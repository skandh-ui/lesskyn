import mongoose from "mongoose";
import { Expert } from "@/models/expert.model";

/* ---------- Input Type ---------- */

interface CreateExpertInput {
  name: string;
  type: "dermatologist" | "influencer";

  email?: string;
  phone?: string;

  socials?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };

  durations: number[]; // [15, 20]
  price: number;

  availabilityPeriod: {
    startTime: string; // "HH:mm"
    endTime: string;   // "HH:mm"
  };

  calendlyLink: string;

  // Profile
  avatar?: string;

  // Dermatologist-only
  degree?: string;
  experienceYears?: number;
  specialization?: string;

  // Influencer-only
  bio?: string;
}

/* ---------- Controller ---------- */

export async function createExpert(input: CreateExpertInput) {
  const {
    name,
    type,
    email,
    phone,
    socials,
    durations,
    price,
    availabilityPeriod,
    calendlyLink,
    avatar,
    degree,
    experienceYears,
    specialization,
    bio,
  } = input;

  /* ---------- Required checks ---------- */

  if (!name || !type) {
    throw new Error("name and type are required");
  }

  if (!["dermatologist", "influencer"].includes(type)) {
    throw new Error("Invalid expert type");
  }

  if (!durations || durations.length === 0) {
    throw new Error("At least one duration is required");
  }

  if (price < 0) {
    throw new Error("Price must be >= 0");
  }

  if (!availabilityPeriod?.startTime || !availabilityPeriod?.endTime) {
    throw new Error("Availability period is required");
  }

  if (!calendlyLink) {
    throw new Error("Calendly link is required");
  }

  /* ---------- Validate availability window ---------- */

  const [startH, startM] = availabilityPeriod.startTime.split(":").map(Number);
  const [endH, endM] = availabilityPeriod.endTime.split(":").map(Number);

  if (
    Number.isNaN(startH) ||
    Number.isNaN(startM) ||
    Number.isNaN(endH) ||
    Number.isNaN(endM)
  ) {
    throw new Error("Invalid availability time format");
  }

  if (endH < startH || (endH === startH && endM <= startM)) {
    throw new Error("availability endTime must be after startTime");
  }

  /* ---------- Type-specific validation ---------- */

  if (type === "dermatologist") {
    if (!degree || !experienceYears || !specialization) {
      throw new Error(
        "Dermatologist requires degree, experienceYears and specialization"
      );
    }
  }

  if (type === "influencer") {
    if (!bio) {
      throw new Error("Influencer bio is required");
    }
  }

  /* ---------- Create Expert ---------- */

  const expert = await Expert.create({
    name,
    type,
    email,
    phone,
    socials,
    durations,
    price,
    availabilityPeriod,
    calendlyLink,
    avatar,

    degree: type === "dermatologist" ? degree : undefined,
    experienceYears: type === "dermatologist" ? experienceYears : undefined,
    specialization: type === "dermatologist" ? specialization : undefined,

    bio: type === "influencer" ? bio : undefined,

    isActive: true,
  });

  return expert;
}


export async function getExpertById(expertId: string) {
  if (!mongoose.isValidObjectId(expertId)) {
    throw new Error("Invalid expertId");
  }

  const expert = await Expert.findById(expertId)
    .select(`
      _id
      name
      type
      email
      phone
      socials
      durations
      price
      weeklyAvailability
      unavailabilities
      avatar
      degree
      experienceYears
      specialization
      bio
      isActive
    `)
    .lean();

  if (!expert) {
    throw new Error("Expert not found");
  }

  if (!expert.isActive) {
    throw new Error("Expert is not active");
  }

  return {
    id: expert._id,
    name: expert.name,
    type: expert.type,

    email: expert.email,
    phone: expert.phone,
    socials: expert.socials,

    durations: expert.durations,
    price: expert.price,
    weeklyAvailability: expert.weeklyAvailability,
    unavailabilities: expert.unavailabilities,

    avatar: expert.avatar,

    ...(expert.type === "dermatologist"
      ? {
          degree: expert.degree,
          experienceYears: expert.experienceYears,
          specialization: expert.specialization,
        }
      : {}),

    ...(expert.type === "influencer"
      ? {
          bio: expert.bio,
        }
      : {}),
  };
}

interface ListExpertsOptions {
  type: "dermatologist" | "influencer";
  page?: number;
  limit?: number;
}

export async function listAllActiveExperts({
  type,
  page = 1,
  limit = 10,
}: ListExpertsOptions) {
  if (!["dermatologist", "influencer"].includes(type)) {
    throw new Error("Invalid expert type");
  }

  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(Math.max(limit, 1), 50);
  const skip = (safePage - 1) * safeLimit;

  const filter = {
    isActive: true,
    type,
  };

  const [experts, totalCount] = await Promise.all([
    Expert.find(filter)
      .select(`
        _id
        name
        type
        socials
        durations
        price
        avatar
        degree
        experienceYears
        specialization
        bio
      `)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),

    Expert.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / safeLimit);

  return {
    experts: experts.map((expert) => ({
      id: expert._id,
      name: expert.name,
      type: expert.type,

      socials: expert.socials,
      durations: expert.durations,
      price: expert.price,
      avatar: expert.avatar,

      ...(expert.type === "dermatologist"
        ? {
            degree: expert.degree,
            experienceYears: expert.experienceYears,
            specialization: expert.specialization,
          }
        : {}),

      ...(expert.type === "influencer"
        ? {
            bio: expert.bio,
          }
        : {}),
    })),

    pagination: {
      page: safePage,
      limit: safeLimit,
      totalPages,
      totalCount,
      hasNextPage: safePage < totalPages,
      hasPrevPage: safePage > 1,
    },
  };
}
