import { useContext, useEffect, useRef, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth, useUser } from "@clerk/clerk-react";
import { UserCreditsContext } from "../context/UserCreditsContext";
import axios from "axios";
import { apiEnpoints } from "../util/apiEnpoints";
import { AlertCircle, Check, CreditCard, Key, Loader2 } from "lucide-react";
import { features } from "../assets/data";

const Subscription = () => {
    const [processingPayment , setProcessingPayment] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType , setMessageType] = useState("");
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    const {getToken} = useAuth();
    const razorpayScriptRef = useRef();
    const {credits, setCredits, fetchUserCredits} = useContext(UserCreditsContext);

    const {user} = useUser();

    const plans = [
        {
            id: "premium",
            name: "Premium",
            credits: 500,
            price: 6,
            features: [
                "Upload up tyo 500 files",
                "Access to all basic features",
                "Priority support"
            ],
            recommended: false
        },
        {
            id: "ultimate",
            name: "Ultimate",
            credits: 5000,
            price: 80,
            features: [
                "Upload up tyo 5000 files",
                "Access to all basic features",
                "Priority support",
                "Advanced analytics"
            ],
            recommended: true 
        }
    ]


    useEffect(() => {
        if(!window.Razorpay){
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.async = true;
            script.onload = () => {
                console.log('Razorpay script loaded successfuly');
                setRazorpayLoaded(true);
            };
            script.onerror = () => {
                console.error('Failed to load Razorpay script');
                setMessage('Payment gateway failed to load Please refresh the page and try again.');
                setMessageType('error');
            };
            document.body.appendChild(script);
            razorpayScriptRef.current = script;
        }
        else{
            setRazorpayLoaded(true); 
        }

        return () => {
            //Clean script on component unmount
            if(razorpayScriptRef.current){
                document.body.removeChild(razorpayScriptRef.current);
            }
        };
    }, []);

    //Fetch user credits on component mount
    useEffect(() => {
        const fetchUserCredits = async () => {
            try{
                const token = await getToken();
                const response = await axios.get(apiEnpoints.GET_CREDITS, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCredits(response.data.credits);
            }
            catch(error){
                console.error("Error fetching user credits", error);
                setMessage("Failed to load your current credits. Please try again later.");
                setMessageType("error");
            }
        };
        fetchUserCredits();
    }, [getToken]);

    const handlePurchase = async (plans) =>  {
        if(!razorpayLoaded){
            setMessage("Payment gateway is still loading. Please wait a moment and try agian.");
            setMessageType('error');
            return;
        }

        setProcessingPayment(true);
        setMessage('');

        try{
            const token = await getToken();
            const response = await axios.post(apiEnpoints.CREATE_ORDER, {
                planId: plans.id,
                amount: plans.price * 2,
                currency: "US",
                credits: plans.credits
            },{
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            });

            const option = {
                Key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: plans.price * 2,
                currency: "US",
                name: "CloudShare",
                description: `Purchase ${plans.credits} credits`,
                order_id: response.data.orderId,
                handle: async function (response) {
                    try {
                        const verifyResponse = await axios.post(apiEnpoints.VERIFY_PAYMENT,{
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planId: plans.id
                        }, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if(verifyResponse.data.success){
                            if(verifyResponse.data.credits){
                                console.log('Updating credits to:', verifyResponse.data.credits);
                                setCredits(verifyResponse.data.credits);
                            }
                            else{
                                console.log('Credits not in response, fetching lates credits');
                                await fetchUserCredits();
                            }

                            setMessage(`Payment successful!! ${plans.name} plan activated.`)
                            setMessageType("success");
                        }
                        else{
                            setMessage("Payment verification failed. Please contact support.");
                            setMessageType("error");
                        }
                    }
                    catch(error){
                        console.error("patment verification error", error);
                        setMessage("Payment verification failed. Please contact support");
                        setMessageType("error");
                    }
                },
                prefill: {
                    name: user.fullName,
                    email: user.primaryEmailAddress
                },
                theme: {
                    color: "#3B82F6"
                }
            };
            if(window.Razorpay){
                const razorpay = new window.Razorpay(option);
                razorpay.open();
            }
            else {
                throw new Error('Razorpay SDK not loaded');
            }
        }
        catch(error){
            console.error("Payment initiation error:", error);
            setMessage("Failed to initiation payment. Please try again later.");
            setMessageType("error");
        }
        finally{
            setProcessingPayment(false);
        }
    }
    

    return (
        <DashboardLayout activeMenu="Subscription">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">Subscripttion Plans</h1>
                <p className="text-gray-600 mb-6">Choose a plan that work for you</p>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                        messageType === 'error' ? 'bg-red-50 text-red-700' :
                            messageType === 'success' ? 'bg-green-50 text-green-700':
                                'bg-blue-50 text-blue-700'
                    }`}>
                        {messageType === 'error' && <AlertCircle size={20} />}
                        {message}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="text-red-500" />
                            <h2 className="text-lg font-medium">Current Credits: <span className="font-bold text-red-500">{credits}</span></h2>

                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            You can upload {credits} more files with your current credits.
                        </p>

                    </div>

                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {plans.map((plans) => (
                        <div   
                            key={plans.id}
                            className={`border rounded-xl p-6 ${
                                plans.recommended
                                    ? 'border-red-200 bg-red-50 shadow-md'
                                    : 'border-gray-200 bg-white'
                            }`}
                        >

                         {plans.recommended && (
                            <div className="relative rounded-xl bg-white shadow">
                                <div className="absolute right-3 top-3 inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-sm ring-1 ring-white/30">
                                    RECOMMENDED
                                </div>
                            </div>
                         )}
                         <h3 className="text-xl font-bold">{plans.name}</h3>
                         <div className="mt-2 mb-4">
                            <span className="text-3xl font-bold">${plans.price}</span>
                            <span className="text-gray-500">for {plans.credits} credits</span>
                        </div>

                        <ul className="space-y-3 mb-6"> 
                            {plans.features.map((features, index) => (
                                <li key={index} className="flex items-start">
                                    <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-"/>
                                    <span>{features}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handlePurchase(plans)}
                            disabled={processingPayment}
                            className={`w-full py-2 rounded-md font-medium transition-colors ${
                                plans.recommended
                                    ? 'bg-red-500 text-white '
                                    : 'bg-white border border-red-500 text-red-500 hover:bg-red-50'
                            } disabled:opacity-50 flex items-center justify-center gap-2`}      
                        >
                            {processingPayment ? (
                                <>
                                    <Loader2 size={16} className="animate-spin"/>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <span>Purchase Plan</span>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-2">How credits work</h3>
                <p className="text-sm text-gray-600">
                    Each file upload consume 1 credits. New user start with 5 Free credits.
                    Credits never expire and can be used at any time. If you run out of credits,
                    you can purchase more through one of our plans above.
                </p>
            </div>

         </div>   
        </DashboardLayout>   
    );
};

export default Subscription;