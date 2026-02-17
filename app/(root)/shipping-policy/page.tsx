import React from "react";

const ShippingPolicy = () => {
    return (
        <div className="min-h-screen bg-[#FFF5F7] py-20 px-6 md:px-20 font-sans text-gray-800 leading-relaxed">
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-[40px] shadow-sm border border-pink-100 text-[15px]">
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-black leading-tight">Shipping Policy</h1>

                <div className="space-y-10">
                    <section>
                        <p className="mb-6 font-medium text-gray-700">
                            <span className="font-bold">SKYN CONSUMERS PRIVATE LIMITED ("Company")</span> provides recommendations and links for skincare products via <span className="font-bold">lesskyn.in</span>. Please note the following regarding the shipment and delivery of goods:
                        </p>
                    </section>

                    {/* --- Section 1: Third-Party Fulfillment --- */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-black border-l-4 border-orange-400 pl-4 uppercase tracking-wide">1. Third-Party Fulfillment</h2>
                        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 space-y-4">
                            <ul className="space-y-4">
                                <li>
                                    <p className="font-bold underline">No In-House Shipping:</p>
                                    <p>The Company does not own, stock, or ship any physical inventory. Therefore, we do not handle the logistics, packaging, or delivery of any products. All physical products featured or recommended on the Platform are sold and shipped by third-party merchants (primarily Amazon.in) or their respective sellers.</p>
                                </li>
                                <li>
                                    <p className="font-bold underline">Shipping Timelines & Costs:</p>
                                    <p>Any information regarding shipping speed (e.g., One-Day Delivery), shipping charges, or "Free Shipping" eligibility is determined solely by the third-party merchant and may vary based on your location and the seller’s terms.</p>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* --- Section 2: Tracking --- */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-black border-l-4 border-blue-400 pl-4 uppercase tracking-wide">2. Tracking Your Order</h2>
                        <p>Since the transaction occurs on a third-party website:</p>
                        <ul className="list-disc pl-6 space-y-4 font-medium">
                            <li>
                                <p><span className="underline">Tracking:</span> You must track your order through the "Your Orders" or "Track Package" section of the third-party platform where the purchase was completed.</p>
                            </li>
                            <li>
                                <p><span className="underline">Notification:</span> All shipping updates, SMS alerts, and delivery confirmations will be sent to you by the third-party merchant, not by Lesskyn.</p>
                            </li>
                        </ul>
                    </section>

                    {/* --- Section 3: Delivery Issues --- */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-black border-l-4 border-red-400 pl-4 uppercase tracking-wide">3. Delivery Issues & Transit Damage</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                                <p className="font-bold mb-2">Non-Delivery:</p>
                                <p className="text-sm">If a package is not delivered or is marked as delivered but not received, you must contact the customer support of the third-party marketplace (e.g., Amazon Customer Service) directly.</p>
                            </div>
                            <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                                <p className="font-bold mb-2">Damaged Items:</p>
                                <p className="text-sm">If a product is damaged during transit, please refer to the merchant’s return/replacement policy. The Company is not liable for any losses or damages incurred during the shipping process.</p>
                            </div>
                        </div>
                    </section>

                    {/* --- Section 4: Service Delivery --- */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-black border-l-4 border-purple-400 pl-4 uppercase tracking-wide">4. Service Delivery (Consultations)</h2>
                        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                            <p className="mb-4 font-medium italic">For digital services, such as consultations with Dermatologists or Skincare Besties:</p>
                            <ul className="list-disc pl-6 space-y-3">
                                <li><span className="font-bold">Method</span>: There is no physical shipping involved. Access to the consultation (video link/call) will be delivered electronically via email or your registered contact method.</li>
                                <li><span className="font-bold">Timeline</span>: Access is provided at the scheduled time chosen during the booking process.</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;
