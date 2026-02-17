import React from "react";
import Link from "next/link";

const ReturnPolicy = () => {
    return (
        <div className="min-h-screen bg-[#FFF5F7] py-20 px-6 md:px-20 font-sans text-gray-800 leading-relaxed">
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-[40px] shadow-sm border border-pink-100 text-[15px]">
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-black leading-tight">Return Policy</h1>

                <div className="space-y-10">
                    <section>
                        <p className="mb-6 font-medium text-gray-700">
                            **SKYN CONSUMERS PRIVATE LIMITED ("Company")** operates **lesskyn.in** as an aggregator platform. Our return policy is structured as follows:
                        </p>
                    </section>

                    {/* --- Section 1: Physical Products --- */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-black border-l-4 border-orange-400 pl-4 uppercase tracking-wide">1. Physical Products (Third-Party Marketplaces)</h2>
                        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 space-y-4">
                            <p>
                                All physical products recommended on the Platform are sold and fulfilled by third-party merchants, primarily **Amazon.in**.
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>**No Direct Returns**: The Company does not stock inventory or ship products. We cannot accept returns, replacements, or exchanges for any physical goods.</li>
                                <li>**Governing Policies**: Any return or refund request must be initiated through the platform where the purchase was completed (e.g., Amazon). These are governed strictly by that merchant’s specific return window and conditions.</li>
                            </ul>
                            <div className="p-4 bg-white/50 rounded-xl italic text-sm text-gray-600 border border-orange-200">
                                **Disclaimer**: We advise users to conduct independent research before purchasing. The Company is not liable for product defects or shipping issues caused by third-party sellers.
                            </div>
                        </div>
                    </section>

                    {/* --- Section 2: Consultation Services --- */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-black border-l-4 border-blue-400 pl-4 uppercase tracking-wide">2. Consultation Services (Dermatologists & Skincare Besties)</h2>
                        <div className="space-y-4">
                            <p>
                                In accordance with the **Indian Contract Act, 1872**, once a consultation session has been attended, the service is deemed **"consumed"** and cannot be returned.
                            </p>
                            <ul className="space-y-4">
                                <li>
                                    <p className="font-bold underline">No Refund for Dissatisfaction:</p>
                                    <p>As an aggregator, we facilitate access to independent Experts but do not control their professional opinions. We do not offer refunds if you are unhappy with the specific advice or suggestions provided during a session.</p>
                                </li>
                                <li>
                                    <p className="font-bold underline">No-Shows and Missed Appointments:</p>
                                    <p>If you fail to attend a scheduled call, or if there is a cancellation request, this is not handled under the Return Policy. Please refer to our <Link href="/refund-policy" className="text-pink-600 font-bold hover:underline">Refund and Cancellation Policy</Link> for specific terms regarding no-shows, penalty charges, and rescheduling timelines.</p>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* --- Section 3: Non-Returnable Scenarios --- */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-black border-l-4 border-gray-400 pl-4 uppercase tracking-wide">3. Non-Returnable Scenarios</h2>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <p className="mb-4">The following are strictly non-returnable:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Used or opened skincare products purchased via third-party links.</li>
                                <li>Service fees for consultations that have already been completed.</li>
                                <li>Requests made after the 72-hour cancellation window (refer to **Refund Policy**).</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ReturnPolicy;
