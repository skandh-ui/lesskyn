# Race Condition Handling for Concurrent Bookings

## Problem

Multiple users can create draft bookings for the same expert (with null startTime/endTime). When they all try to pay and select the same time slot simultaneously, there's a race condition.

## Solution Architecture

### 1. **Draft Bookings (Payment Pending)**

- Users can create multiple draft bookings with `status: "payment_pending"`
- Draft bookings have `startTime: null` and `endTime: null`
- No conflicts at this stage

### 2. **Slot Selection & Payment Initiation**

When a user selects a slot and initiates payment:

#### Database Level Protection

```typescript
// Unique index in booking.model.ts (lines 168-178)
bookingSchema.index(
  { expert: 1, startTime: 1, endTime: 1 },
  {
    unique: true,
    partialFilterExpression: {
      startTime: { $ne: null },
      endTime: { $ne: null },
    },
  },
);
```

- Only enforces uniqueness when times are NOT null
- Allows multiple drafts but prevents duplicate confirmed slots

#### Transaction Level Protection

```typescript
// In initiatePayment() controller
const session = await mongoose.startSession();
session.startTransaction();

try {
  // 1. Check for overlapping bookings
  const overlappingBooking = await Booking.findOne({...});

  // 2. Assign slot times
  booking.startTime = startUTC;
  booking.endTime = endUTC;

  // 3. Save (triggers unique index check)
  await booking.save({ session });

  // 4. Commit transaction
  await session.commitTransaction();

} catch (err) {
  // MongoDB E11000 duplicate key error
  if (err.code === 11000) {
    throw new Error("This slot was just booked by another user...");
  }
}
```

### 3. **Race Condition Scenario**

**Timeline:**

```
User A: Creates draft booking A
User B: Creates draft booking B
User C: Creates draft booking C

// All select same slot at 10:00 AM

User A: Starts transaction → Checks availability → Slot free ✓
User B: Starts transaction → Checks availability → Slot free ✓
User C: Starts transaction → Checks availability → Slot free ✓

User A: Assigns 10:00 slot → Saves → COMMITS ✓
User B: Assigns 10:00 slot → Saves → E11000 ERROR ❌ (index catches it)
User C: Assigns 10:00 slot → Saves → E11000 ERROR ❌ (index catches it)
```

### 4. **User Experience**

**Winner (First to commit):**

- Slot assigned successfully
- Redirected to payment gateway
- Booking moves to "paid" status after payment

**Losers (Race lost):**

- Get user-friendly error: "This slot was just booked by another user"
- Available slots auto-refresh
- Can select a different time slot
- Draft booking remains valid for retry

### 5. **Cleanup**

Draft bookings have TTL (Time To Live):

```typescript
// Auto-expires after 15 minutes if unpaid
bookingSchema.index(
  { expiresAt: 1 },
  {
    expires: 0,
    partialFilterExpression: { status: "payment_pending" },
  },
);
```

## Benefits

✅ **No overbooking** - Database enforces uniqueness at slot assignment
✅ **Fair queuing** - First to commit wins
✅ **Good UX** - Losers get clear feedback and can retry
✅ **Clean database** - Expired drafts auto-delete
✅ **Scalable** - Handles high concurrency without application-level locking

## Migration Required

Run this once to update the index:

```bash
node scripts/fixBookingIndex.js
```
