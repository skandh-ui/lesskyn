import React from "react";

const RefundPolicy = () => {
    return (
        <div className="min-h-screen bg-[#FFF5F7] py-20 px-6 md:px-20 font-sans text-gray-800 leading-relaxed">
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-[40px] shadow-sm border border-pink-100 text-[15px]">
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-black leading-tight">Refund and Cancellation Policy</h1>

                <div className="space-y-10">
                    <section>
                        <p className="mb-6 font-medium text-gray-700">
                            This policy governs the cancellation and refund process for products and services facilitated through the **LesSkyn Platform**.
                        </p>
                    </section>

                    {/* --- Section 1: Third-Party --- */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-black border-l-4 border-orange-400 pl-4 uppercase tracking-wide">1. Third-Party Product Purchases (e.g., Amazon)</h2>
                        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 space-y-4">
                            <p>
                                The Platform provides links to third-party marketplaces, including but not limited to **Amazon.in**.
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>**Applicability**: All cancellations, returns, and refunds for physical products are governed exclusively by the policies of the respective third-party marketplace (e.g., Amazon's Conditions of Use).</li>
                                <li>**No Platform Liability**: The Company does not handle, process, or guarantee refunds for products sold on third-party platforms. Any disputes regarding product quality, delivery, or returns must be directed to the third-party seller or marketplace.</li>
                            </ul>
                        </div>
                    </section>

                    {/* --- Section 2: Skincare Consultations --- */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-black border-l-4 border-pink-400 pl-4 uppercase tracking-wide">2. Skincare Consultations (Dermatologists & Skincare Besties)</h2>
                        <p>
                            All bookings for professional consultations are subject to the following professional service agreement:
                        </p>
                        <ul className="space-y-4">
                            <li>
                                <p className="font-bold underline underline-offset-4">User-Initiated Cancellation:</p>
                                <ul className="list-disc pl-6 mt-2">
                                    <li>To be eligible for a refund, you must notify us at **skandh@lesskyn.in** at least **72 hours** prior to the scheduled consultation time.</li>
                                </ul>
                            </li>
                            <li>
                                <p className="font-bold underline underline-offset-4">Partial Refund:</p>
                                <p className="mt-2 text-red-700 font-medium italic">
                                    Since the Company incurs non-refundable payment gateway charges and administrative overheads upon booking, only 70% of the total booking amount will be refunded for valid 72-hour cancellation requests.
                                </p>
                            </li>
                            <li>
                                <p className="font-bold underline underline-offset-4">Rescheduling:</p>
                                <ul className="list-disc pl-6 mt-2">
                                    <li>Rescheduling requests must be submitted via email at least **24 hours** prior to the session.</li>
                                    <li>While the Company will act as an intermediary to facilitate the change, rescheduling is subject to the Expert’s availability and is not guaranteed.</li>
                                </ul>
                            </li>
                            <li>
                                <p className="font-bold underline underline-offset-4 text-gray-900 border-b-2 border-red-200 inline-block">No-Show Policy:</p>
                                <p className="mt-2">
                                    If a user fails to attend a scheduled consultation ("No-Show") without providing the required 72-hour notice, **no refund shall be issued**. Any subsequent rescheduling will be at the sole discretion and "will" of the Expert, and the Company provides no guarantee for a makeup session.
                                </p>
                            </li>
                        </ul>
                    </section>

                    {/* --- Section 3: Expert-Initiated --- */}
                    <section className="space-y-4 bg-gray-50 p-8 rounded-[32px] border border-gray-100">
                        <h2 className="text-xl font-bold text-black border-l-4 border-gray-400 pl-4 uppercase tracking-wide">3. Expert-Initiated Cancellation & No-Shows</h2>
                        <ul className="space-y-4">
                            <li>
                                <p className="font-bold underline underline-offset-2">Expert Cancellation:</p>
                                <p>If a Dermatologist or Skincare Bestie needs to cancel, they must inform the Platform at least 72 hours prior. In such cases, the Company will attempt to assign an alternative Expert to the user.</p>
                            </li>
                            <li>
                                <p className="font-bold underline underline-offset-2">Expert No-Show:</p>
                                <p>If an Expert fails to attend a consultation without prior notice, the Expert shall be liable to compensate the Company a penalty equivalent to 12% of the consultation fee.</p>
                            </li>
                            <li>
                                <p className="font-bold underline underline-offset-2 text-purple-700">User Remedy:</p>
                                <p>In the event of an Expert No-Show, the User may choose between a reschedule or a full refund. However, the final resolution depends on the User’s consent, and the Platform Owner disclaims liability for any inconvenience caused by the Expert's absence.</p>
                            </li>
                        </ul>
                    </section>

                    {/* --- Section 4: Protocol --- */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-black border-l-4 border-pink-400 pl-4 uppercase tracking-wide">4. Communication Protocol</h2>
                        <p className="bg-white border-2 border-pink-100 p-6 rounded-2xl italic shadow-sm">
                            All formal communications regarding cancellations, refunds, or rescheduling must be sent to **skandh@lesskyn.in**. Communications via social media, WhatsApp, or other unofficial channels will not be considered valid notice under this policy.
                        </p>
                    </section>

                    {/* --- Section 5: Processing Time --- */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-black border-l-4 border-pink-400 pl-4 uppercase tracking-wide">5. Refund Processing Time</h2>
                        <p>
                            Once a refund is approved by the Company in writing, it will take approximately **5 to 7 business days** for the amount to be credited back to the original payment source, subject to bank processing times.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
