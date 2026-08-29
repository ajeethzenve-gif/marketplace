import React, { useState } from "react";
import {
  FaUndoAlt,
  FaMoneyBillWave,
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaQuestionCircle,
  FaChevronDown,
} from "react-icons/fa";
import "../styles/RefundAndReturn.css"

const RefundReturn = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I request a return?",
      answer:
        "Go to your Orders section, select the product you want to return, and choose the Return option. Follow the instructions to submit your return request.",
    },
    {
      question: "How long do I have to return a product?",
      answer:
        "You can request a return within the return period mentioned on the product/order details page.",
    },
    {
      question: "When will I receive my refund?",
      answer:
        "Once the returned product is received and successfully inspected, the refund will be initiated. The amount may take a few business days to appear in your account depending on your payment method.",
    },
    {
      question: "Can I return a damaged product?",
      answer:
        "Yes. If your product arrives damaged, defective, or incorrect, please submit a return request as soon as possible with clear photos of the product and packaging.",
    },
    {
      question: "Are shipping charges refundable?",
      answer:
        "Shipping charges may or may not be refundable depending on the reason for the return and the applicable product policy.",
    },
  ];

  return (
    <div className="refund-return-page">
      {/* Page Header */}
      <section className="refund-header">
        <div className="refund-header-content">
          <div className="header-icon">
            <FaUndoAlt />
          </div>

          <h1>Refund & Return</h1>

          <p>
            We want you to have a smooth shopping experience. Learn about our
            return, replacement, and refund process below.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="refund-container">
        {/* Return & Refund Cards */}
        <section className="info-grid">
          <div className="info-card">
            <div className="info-icon return-icon">
              <FaUndoAlt />
            </div>

            <h2>Returns</h2>

            <p>
              If you are not satisfied with your purchase, you may be able to
              return the product according to the applicable product return
              policy.
            </p>

            <ul>
              <li>
                <FaCheckCircle />
                Product should be in acceptable condition.
              </li>

              <li>
                <FaCheckCircle />
                Original packaging should be retained where applicable.
              </li>

              <li>
                <FaCheckCircle />
                Return request must be submitted within the allowed period.
              </li>
            </ul>
          </div>

          <div className="info-card">
            <div className="info-icon refund-icon">
              <FaMoneyBillWave />
            </div>

            <h2>Refunds</h2>

            <p>
              Once your returned product is received and approved, the refund
              will be processed using the applicable refund method.
            </p>

            <ul>
              <li>
                <FaCheckCircle />
                Refund is initiated after return verification.
              </li>

              <li>
                <FaCheckCircle />
                Processing time depends on your payment method.
              </li>

              <li>
                <FaCheckCircle />
                You will be notified when your refund is processed.
              </li>
            </ul>
          </div>
        </section>

        {/* Eligibility */}
        <section className="content-section">
          <div className="section-title">
            <FaCheckCircle />
            <h2>Return Eligibility</h2>
          </div>

          <p>
            A product may be eligible for return if it meets the applicable
            return conditions. Please check the product-specific return policy
            before placing a return request.
          </p>

          <div className="eligibility-grid">
            <div className="eligibility-item">
              <FaCheckCircle />
              <div>
                <h3>Unused Product</h3>
                <p>
                  Products should generally be unused and in suitable
                  condition for return.
                </p>
              </div>
            </div>

            <div className="eligibility-item">
              <FaCheckCircle />
              <div>
                <h3>Original Packaging</h3>
                <p>
                  Keep the original box, accessories, tags, and other
                  applicable items.
                </p>
              </div>
            </div>

            <div className="eligibility-item">
              <FaCheckCircle />
              <div>
                <h3>Return Period</h3>
                <p>
                  Submit your return request within the applicable return
                  window.
                </p>
              </div>
            </div>

            <div className="eligibility-item">
              <FaCheckCircle />
              <div>
                <h3>Proof of Purchase</h3>
                <p>
                  Your order details or invoice may be required to process the
                  request.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Return Process */}
        <section className="content-section">
          <div className="section-title">
            <FaBoxOpen />
            <h2>How to Return a Product</h2>
          </div>

          <div className="process-grid">
            <div className="process-card">
              <div className="step-number">1</div>
              <FaBoxOpen />
              <h3>Select Your Order</h3>
              <p>
                Open your orders and select the product you want to return.
              </p>
            </div>

            <div className="process-card">
              <div className="step-number">2</div>
              <FaUndoAlt />
              <h3>Request Return</h3>
              <p>
                Select the return option and provide the reason for returning
                the product.
              </p>
            </div>

            <div className="process-card">
              <div className="step-number">3</div>
              <FaClock />
              <h3>Product Pickup</h3>
              <p>
                If eligible, the product will be collected according to the
                applicable pickup process.
              </p>
            </div>

            <div className="process-card">
              <div className="step-number">4</div>
              <FaMoneyBillWave />
              <h3>Refund</h3>
              <p>
                After verification, your refund will be initiated through the
                applicable payment method.
              </p>
            </div>
          </div>
        </section>

        {/* Refund Process */}
        <section className="refund-process">
          <div className="refund-process-content">
            <div className="refund-process-icon">
              <FaMoneyBillWave />
            </div>

            <div>
              <h2>Refund Processing</h2>

              <p>
                Refunds are processed after the returned product has been
                received and verified. The time required for the amount to
                reflect in your account depends on your bank or payment
                provider.
              </p>

              <div className="refund-notice">
                <FaClock />
                <span>
                  Please allow additional processing time depending on your
                  payment method.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Non Returnable */}
        <section className="content-section">
          <div className="section-title">
            <FaQuestionCircle />
            <h2>Non-Returnable Products</h2>
          </div>

          <p>
            Some products may not be eligible for return due to their nature,
            hygiene requirements, customization, or product-specific
            restrictions.
          </p>

          <div className="warning-box">
            <strong>Please note:</strong>

            <span>
              Return eligibility can vary by product. Always check the return
              information displayed on the product or order page.
            </span>
          </div>
        </section>

        {/* FAQ */}
        <section className="content-section faq-section">
          <div className="section-title">
            <FaQuestionCircle />
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div
                className={`faq-item ${
                  openFaq === index ? "faq-active" : ""
                }`}
                key={index}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{faq.question}</span>

                  <FaChevronDown
                    className={openFaq === index ? "rotate-icon" : ""}
                  />
                </button>

                {openFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Styles */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        .refund-return-page {
          min-height: 100vh;
          background: #f7f8fa;
          color: #222;
          font-family: Arial, Helvetica, sans-serif;
        }

        /* Header */

        .refund-header {
          background: linear-gradient(135deg, #1f2937, #374151);
          color: #fff;
          padding: 70px 20px;
          text-align: center;
        }

        .refund-header-content {
          max-width: 850px;
          margin: auto;
        }

        .header-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 30px;
        }

        .refund-header h1 {
          margin: 0 0 15px;
          font-size: 42px;
          font-weight: 700;
        }

        .refund-header p {
          margin: 0;
          font-size: 17px;
          line-height: 1.7;
          color: #e5e7eb;
        }

        /* Container */

        .refund-container {
          width: min(1150px, calc(100% - 40px));
          margin: 45px auto;
        }

        /* Cards */

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 25px;
          margin-bottom: 35px;
        }

        .info-card {
          background: #fff;
          padding: 30px;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
        }

        .info-icon {
          width: 55px;
          height: 55px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 23px;
          margin-bottom: 18px;
        }

        .return-icon {
          background: #eef2ff;
          color: #4f46e5;
        }

        .refund-icon {
          background: #ecfdf5;
          color: #059669;
        }

        .info-card h2 {
          margin: 0 0 12px;
          font-size: 24px;
        }

        .info-card p {
          color: #6b7280;
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .info-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .info-card li {
          display: flex;
          gap: 10px;
          margin: 12px 0;
          color: #4b5563;
          line-height: 1.5;
        }

        .info-card li svg {
          color: #10b981;
          flex-shrink: 0;
          margin-top: 3px;
        }

        /* Content */

        .content-section {
          background: #fff;
          padding: 32px;
          margin-bottom: 30px;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
        }

        .section-title svg {
          color: #4f46e5;
          font-size: 22px;
        }

        .section-title h2 {
          margin: 0;
          font-size: 25px;
        }

        .content-section > p {
          color: #6b7280;
          line-height: 1.7;
          margin-bottom: 25px;
        }

        /* Eligibility */

        .eligibility-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .eligibility-item {
          display: flex;
          gap: 15px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 10px;
        }

        .eligibility-item > svg {
          color: #10b981;
          font-size: 20px;
          margin-top: 3px;
          flex-shrink: 0;
        }

        .eligibility-item h3 {
          margin: 0 0 7px;
          font-size: 17px;
        }

        .eligibility-item p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.5;
        }

        /* Process */

        .process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-top: 25px;
        }

        .process-card {
          position: relative;
          text-align: center;
          padding: 25px 15px;
          background: #f9fafb;
          border-radius: 12px;
        }

        .step-number {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #4f46e5;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: bold;
        }

        .process-card > svg {
          font-size: 27px;
          color: #4f46e5;
          margin: 10px 0 15px;
        }

        .process-card h3 {
          font-size: 16px;
          margin: 0 0 8px;
        }

        .process-card p {
          font-size: 13px;
          line-height: 1.5;
          color: #6b7280;
          margin: 0;
        }

        /* Refund Process */

        .refund-process {
          background: #eef2ff;
          border-radius: 14px;
          padding: 30px;
          margin-bottom: 30px;
        }

        .refund-process-content {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .refund-process-icon {
          width: 55px;
          height: 55px;
          border-radius: 12px;
          background: #fff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 23px;
          flex-shrink: 0;
        }

        .refund-process h2 {
          margin: 0 0 10px;
          font-size: 23px;
        }

        .refund-process p {
          color: #4b5563;
          line-height: 1.7;
          margin: 0 0 15px;
        }

        .refund-notice {
          display: flex;
          gap: 10px;
          align-items: center;
          color: #4338ca;
          font-size: 14px;
          font-weight: 600;
        }

        /* Warning */

        .warning-box {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          border-radius: 10px;
          padding: 18px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          color: #9a3412;
          line-height: 1.6;
        }

        /* FAQ */

        .faq-list {
          margin-top: 25px;
        }

        .faq-item {
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          margin-bottom: 12px;
          overflow: hidden;
        }

        .faq-question {
          width: 100%;
          border: none;
          background: #fff;
          padding: 19px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          text-align: left;
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
        }

        .faq-question svg {
          transition: transform 0.25s ease;
          flex-shrink: 0;
          margin-left: 15px;
        }

        .rotate-icon {
          transform: rotate(180deg);
        }

        .faq-answer {
          padding: 0 20px 20px;
          background: #fff;
        }

        .faq-answer p {
          margin: 0;
          color: #6b7280;
          line-height: 1.7;
          font-size: 14px;
        }

        .faq-active .faq-question {
          color: #4f46e5;
        }

        /* Responsive */

        @media (max-width: 900px) {
          .process-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .refund-header {
            padding: 50px 20px;
          }

          .refund-header h1 {
            font-size: 32px;
          }

          .info-grid,
          .eligibility-grid {
            grid-template-columns: 1fr;
          }

          .refund-container {
            width: min(100% - 25px, 1150px);
            margin: 25px auto;
          }

          .content-section,
          .info-card {
            padding: 22px;
          }
        }

        @media (max-width: 500px) {
          .process-grid {
            grid-template-columns: 1fr;
          }

          .refund-process-content {
            flex-direction: column;
          }

          .refund-header p {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default RefundReturn;