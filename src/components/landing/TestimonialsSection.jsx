import React from "react";
import { testimonials as defaultTestimonials } from "../../assets/data"; 

const TestimonialsSection = ({ testimonials }) => {
  const items = testimonials && testimonials.length ? testimonials : defaultTestimonials;
    return (
        <div className="py-20 bg-white overflow-hidden">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl"> 
                            Trusted by Professionals Worldwide
                        </h2>
                        <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
                            See what our users have to say about CloudShare
                        </p>
                    </div>
                    <div className="mt-16 grid gap-8 lg:grid-cols-3">
                        {items.map((t, idx)=>(
                            <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-500 hover:scale-105">
                                <div className="p-8">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-12 w-12">   
                                            <img src={t.img || t.image || "/images/placeholder.jpg"} alt={t.name} className="h-12 w-12 rounded-full object-cover"/>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-bold text-gray-900"> 
                                                {t.name}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {t.role},{t.company}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center"></div>
                                    <blockquote className="mt-4 text-gray-700 leading-7">
                                        {t.quote ? `“${t.quote}”` : "“No comment provided.”"}
                                    </blockquote>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestimonialsSection;