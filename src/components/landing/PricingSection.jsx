// src/components/landing/PricingSection.jsx
import React from "react";
import { Check } from "lucide-react";
import { pricingPlans as defaultPlans } from "../../assets/data";

const PricingSection = ({ pricingPlans }) => {
  const plans = pricingPlans && pricingPlans.length ? pricingPlans : defaultPlans;

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Choose the plan that's right for you
          </p>
        </div>

        <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col rounded-lg shadow-lg overflow-hidden transition ${
                plan.highlighted
                  ? "border-2 border-red-500 ring-2 ring-red-100"
                  : "border border-gray-100"
              }`}
            >
              {/* Header */}
              <div
                className={`px-6 py-8 ${
                  plan.highlighted ? "bg-gradient-to-br from-red-50 to-white" : "bg-white"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
                  {plan.highlighted && (
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      Popular
                    </span>
                  )}
                </div>

                {plan.description && (
                  <p className="mt-3 text-sm text-gray-600">{plan.description}</p>
                )}

                <div className="mt-8 flex items-baseline gap-2">
                  {plan.currency && (
                    <span className="text-2xl font-semibold text-gray-900">{plan.currency}</span>
                  )}
                  <span className="text-4xl font-bold text-gray-900">
                    {typeof plan.price === "number" ? plan.price.toLocaleString() : plan.price}
                  </span>
                  {plan.period && <span className="text-sm text-gray-500">{plan.period}</span>}
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6">
                <ul className="space-y-4">
                  {(plan.features || []).map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-red-500" />
                      </div>
                      <p className="ml-3 text-base text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>

                <div className="rounded-md shadow">
                  <button
                    type="button"
                    className={`w-full inline-flex justify-center items-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      plan.highlighted
                        ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                        : "bg-white text-gray-900 ring-1 ring-gray-300 hover:bg-gray-100 focus:ring-gray-400"
                    }`}
                  >
                    {plan.cta || "Choose plan"}
                  </button>
                </div>
              </div>
              {/* END Body */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
