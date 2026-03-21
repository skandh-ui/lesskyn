import crypto from "crypto";

const PAYU_KEY = process.env.PAYU_KEY!;
const PAYU_SALT = process.env.PAYU_SALT!;
const PAYU_URL = process.env.PAYU_URL!;

export function createPayuPayment(payload: {
  bookingId: string;
  amount: number;
  name: string;
  email: string;
  phone: string;
}) {
  const { bookingId, amount, name, email, phone } = payload;

  const txnid = bookingId;
  const productinfo = "Skin Consultation";
  const amountStr = amount.toFixed(2);

  // Hash: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
  const hashString = `${PAYU_KEY}|${txnid}|${amountStr}|${productinfo}|${name}|${email}|||||||||||${PAYU_SALT}`;
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  return {
    payuUrl: PAYU_URL,
    params: {
      key: PAYU_KEY,
      txnid,
      amount: amountStr,
      productinfo,
      firstname: name,
      email,
      phone,
      surl: `${process.env.FRONTEND_URL}/booking/success?bookingId=${bookingId}`,
      furl: `${process.env.FRONTEND_URL}/booking/failed`,
      hash,
    },
  };
}
