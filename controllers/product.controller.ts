import { matchCSVRows } from "@/lib/csv";

export interface QuizProductInput {
  commitment: "minimal" | "moderate" | "extensive";
  skinType: string;
  concern: string;
  preference: string;
}

interface ProductData {
  name: string;
  company?: string;
  pictureLink?: string;
  amazon?: {
    link: string;
    price?: number;
  };
}

interface ProductStepGroup {
  step: number;
  label: string;
  products: ProductData[];
}

interface RoutineOutput {
  AM_Routine: ProductStepGroup[];
  PM_Routine: ProductStepGroup[];
  Weekly_Routine: ProductStepGroup[];
}

/* ---------- STEP CONFIGURATION ---------- */

interface StepConfig {
  linkColumn: string;
  nameColumn: string;
  imageColumn: string;
  label: string;
  routine: "AM" | "PM" | "Weekly";
}

const STEP_CONFIGS: Record<
  "minimal" | "moderate" | "extensive",
  StepConfig[]
> = {
  minimal: [
    // AM Routine
    { 
      linkColumn: "Facewash AM link", 
      nameColumn: "Facewash AM name", 
      imageColumn: "Facewash AM image",
      label: "Facewash", 
      routine: "AM" 
    },
    { 
      linkColumn: "Moisturiser AM link", 
      nameColumn: "Moisturiser AM name", 
      imageColumn: "Moisturiser AM image",
      label: "Moisturiser", 
      routine: "AM" 
    },
    { 
      linkColumn: "Sunscreen AM link", 
      nameColumn: "Sunscreen AM name", 
      imageColumn: "Sunscreen AM image",
      label: "Sunscreen", 
      routine: "AM" 
    },
    // PM Routine
    { 
      linkColumn: "Facewash PM", 
      nameColumn: "Facewash PM name", 
      imageColumn: "Facewash AM image", // Note: Your CSV has "Facewash AM image" for PM
      label: "Facewash", 
      routine: "PM" 
    },
    { 
      linkColumn: "Serum PM Link", 
      nameColumn: "Serum PM Name", 
      imageColumn: "Serum PM Image",
      label: "Serum", 
      routine: "PM" 
    },
    { 
      linkColumn: "Moisturiser PM link", 
      nameColumn: "Moisturiser PM name", 
      imageColumn: "Moisturiser PM image",
      label: "Moisturiser", 
      routine: "PM" 
    },
    // Weekly
    { 
      linkColumn: "Weekly link", 
      nameColumn: "Weekly name", 
      imageColumn: "Weekly image",
      label: "Weekly Treatment", 
      routine: "Weekly" 
    },
  ],
  moderate: [
    // AM Routine
    { 
      linkColumn: "Facewash AM", 
      nameColumn: "Facewash AM name", 
      imageColumn: "Facewash AM image",
      label: "Facewash", 
      routine: "AM" 
    },
    { 
      linkColumn: "Serum AM Link", 
      nameColumn: "Serum AM Name", 
      imageColumn: "Serum AM Image",
      label: "Antioxidant Serum", 
      routine: "AM" 
    },
    { 
      linkColumn: "Moisturiser AM ", 
      nameColumn: "Moisturiser AM name", 
      imageColumn: "Moisturiser AM image",
      label: "Moisturiser", 
      routine: "AM" 
    },
    { 
      linkColumn: "Sunscreen AM", 
      nameColumn: "Sunscreen AM name", 
      imageColumn: "Sunscreen AM image",
      label: "Sunscreen", 
      routine: "AM" 
    },
    // PM Routine
    { 
      linkColumn: "Facewash PM", 
      nameColumn: "Facewash PM name", 
      imageColumn: "Facewash AM image", // Note: Your CSV has "Facewash AM image" for PM
      label: "Facewash", 
      routine: "PM" 
    },
    { 
      linkColumn: "Serum PM", 
      nameColumn: "Serum PM Name", 
      imageColumn: "Serum PM Image",
      label: "Treatment Serum", 
      routine: "PM" 
    },
    { 
      linkColumn: "Moisturiser PM", 
      nameColumn: "Moisturiser PM name", 
      imageColumn: "Moisturiser PM image",
      label: "Moisturiser", 
      routine: "PM" 
    },
    // Weekly
    { 
      linkColumn: "Weekly", 
      nameColumn: "Weekly name", 
      imageColumn: "Weekly image",
      label: "Weekly Treatment", 
      routine: "Weekly" 
    },
  ],
  extensive: [
    // AM Routine
    { 
      linkColumn: "Facewash AM", 
      nameColumn: "Facewash AM name", 
      imageColumn: "Facewash AM image",
      label: "Facewash", 
      routine: "AM" 
    },
    { 
      linkColumn: "Toner AM link", 
      nameColumn: "Toner AM name", 
      imageColumn: "Toner AM image",
      label: "Toner", 
      routine: "AM" 
    },
    { 
      linkColumn: "Serum AM Link", 
      nameColumn: "Serum AM Name", 
      imageColumn: "Serum AM Image",
      label: "Antioxidant Serum", 
      routine: "AM" 
    },
    { 
      linkColumn: "Moisturiser AM ", 
      nameColumn: "Moisturiser AM name", 
      imageColumn: "Moisturiser AM image",
      label: "Moisturiser", 
      routine: "AM" 
    },
    { 
      linkColumn: "Sunscreen AM", 
      nameColumn: "Sunscreen AM name", 
      imageColumn: "Sunscreen AM image",
      label: "Sunscreen", 
      routine: "AM" 
    },
    // PM Routine
    { 
      linkColumn: "Facewash PM", 
      nameColumn: "Facewash PM name", 
      imageColumn: "Facewash AM image", // Note: Your CSV has "Facewash AM image" for PM
      label: "Cleanser", 
      routine: "PM" 
    },
    { 
      linkColumn: "Toner PM link", 
      nameColumn: "Toner PM name", 
      imageColumn: "Toner PM image",
      label: "Toner", 
      routine: "PM" 
    },
    { 
      linkColumn: "Serum PM", 
      nameColumn: "Serum PM Name", 
      imageColumn: "Serum PM Image",
      label: "Treatment Serum", 
      routine: "PM" 
    },
    { 
      linkColumn: "Moisturiser PM", 
      nameColumn: "Moisturiser PM name", 
      imageColumn: "Moisturiser PM image",
      label: "Moisturiser", 
      routine: "PM" 
    },
    // Weekly
    { 
      linkColumn: "Weekly", 
      nameColumn: "Weekly name", 
      imageColumn: "Weekly image",
      label: "Weekly Treatment", 
      routine: "Weekly" 
    },
  ],
};

export async function getProductsAfterQuiz(
  input: QuizProductInput
): Promise<RoutineOutput> {
  const matchedRows = await matchCSVRows({
    commitment: input.commitment,
    skinType: input.skinType,
    concern: input.concern,
    preference: input.preference,
  });

  if (!matchedRows || matchedRows.length === 0) {
    return {
      AM_Routine: [],
      PM_Routine: [],
      Weekly_Routine: [],
    };
  }

  const groupedProducts = mapCSVRowsToGroupedProducts(
    matchedRows,
    input.commitment
  );

  return groupedProducts;
}

/* ---------- Grouping Logic ---------- */

function mapCSVRowsToGroupedProducts(
  rows: Record<string, string>[],
  commitment: "minimal" | "moderate" | "extensive"
): RoutineOutput {
  const stepConfigs = STEP_CONFIGS[commitment];

  const routines: RoutineOutput = {
    AM_Routine: [],
    PM_Routine: [],
    Weekly_Routine: [],
  };

  // Group step configs by routine type
  const amSteps = stepConfigs.filter((s) => s.routine === "AM");
  const pmSteps = stepConfigs.filter((s) => s.routine === "PM");
  const weeklySteps = stepConfigs.filter((s) => s.routine === "Weekly");

  // Process AM Routine
  processRoutineSteps(rows, amSteps, routines.AM_Routine);

  // Process PM Routine
  processRoutineSteps(rows, pmSteps, routines.PM_Routine);

  // Process Weekly Routine
  processRoutineSteps(rows, weeklySteps, routines.Weekly_Routine);

  return routines;
}

function processRoutineSteps(
  rows: Record<string, string>[],
  stepConfigs: StepConfig[],
  outputArray: ProductStepGroup[]
): void {
  stepConfigs.forEach((config, index) => {
    const seen = new Set<string>();
    const products: ProductData[] = [];

    for (const row of rows) {
      const link = row[config.linkColumn]?.trim();
      const name = row[config.nameColumn]?.trim();
      const image = row[config.imageColumn]?.trim();

      // Skip if no link or already added
      if (!link || seen.has(link)) continue;
      
      seen.add(link);

      products.push({
        name: name || config.label, // Use CSV name or fallback to label
        pictureLink: image || undefined,
        amazon: { link },
      });
    }

    if (products.length > 0) {
      outputArray.push({
        step: index + 1,
        label: config.label,
        products,
      });
    }
  });
}