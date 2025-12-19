import { useEffect, useState } from "react";
import { countrys } from "./countrys.js";


const SECTION_LABELS = {
  easy_gold: "Easy Gold",
  advance_booking: "Advance Booking",
  ecommerce: "Ecommerce",
  e_gifting: "E-Gifting",
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [status, setStatus] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [orderid, setorderId] = useState('');
  const [country, setCountry] = useState('');

  const countryCurrency = {
    UK: 'GBP',
    US: 'USD',
    // UAE: 'AED',
  };





  const handlePay = async (type, currency,key,reference_ID,mid) => {
    setLoading(true);
    try {
      const res = await fetch("/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount, type: type, currency: currency ,key:key,reference_ID:reference_ID, mid:mid })
      });
      const data = await res.json();
      console.log(data);
      setorderId(data.order_id)

      if (data.payment_links?.web) {
        // Redirect to Juspay Payment Page
        // window.location.href = data.payment_links.web;
        setPaymentUrl(data.payment_links.web);   // ⬅️ SET IFRAME URL
      } else {
        alert("Failed to start payment session");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const orderId = new URLSearchParams(window.location.search).get("order_id");

    if (orderId) {
      fetch(`/order-status/${orderId}`)
        .then(res => res.json())
        .then(data => {
          console.log(data)
          if (data.status === "CHARGED" || data.status === "AUTHORIZED") {
            setStatus("✅ Payment Successful (" + data.status + ")");
            setOrderNumber("Order ID: #" + data.order_id + "");
          } else {
            setStatus(`❌ Payment ${data.status}`);
            setOrderNumber("Order ID:" + data?.order_id + "");
          }
        })
        .catch(err => {
          console.error(err);
          setStatus("⚠️ Could not fetch payment status");
        });
    }
  }, []);

  // Button style for beautified layout
  const buttonStyle = {
    padding: "12px 0",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(90deg, #667eea 0%, #5a67d8 100%)",
    color: "#fff",
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
    transition: "background 0.2s, box-shadow 0.2s",
    boxShadow: "0 2px 8px rgba(102,126,234,0.08)",
    outline: "none",
    margin: 0,
    width: "100%",
    minHeight: 44,
    letterSpacing: 0.5
  };

const getFirstReferenceId = (sectionConfig) => {
  if (!sectionConfig?.payment_methods) return null;

  const methods = Object.values(sectionConfig.payment_methods);
  return methods[0]?.reference_ID || null;
};


  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7fafc" }}>
      <div style={{
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        padding: 44,
        minWidth: 350,
        maxWidth: 640,
        width: "100%",
        textAlign: "center",
        border: '2px solid #e2e8f0'
      }}>
        <div style={{flexDirection:'row',display:'flex', justifyContent:'center',alignItems:'center',gap:"20px"}}>

        <h1 style={{ marginBottom: 24, color: "#1a202c", fontWeight: 800, fontSize: 30, letterSpacing: 1 }}>Juspay Integration Demo</h1>
                <div >
                  <label htmlFor="country-select" style={{ fontWeight: 600, marginRight: 10, color: '#1a202c', fontSize: 16 }}>Country:</label>
                  <select
                    id="country-select"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16 }}
                  >
                    <option value="">Select</option>
                    <option value="UK">UK</option>
                    <option value="US">US</option>
                    <option value="SG">SG</option>
                    {/* <option value="UAE">UAE</option> */}
                  </select>
                </div>
                </div>

        {/* If paymentUrl exists → show iframe */}
        {
          paymentUrl
            ? (
              <iframe
                src={paymentUrl}
                style={{
                  width: "80%",
                  height: "500px",
                  border: "none",
                  marginTop: 20,
                }}
                allow="payment *"
              ></iframe>
            )
            : (
              <>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    // marginBottom: 14,
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 16,
                    width: "100%",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                  {/* {country && <h4>Currency: {countryCurrency[country]}</h4>} */}
                {
                  country && (() => {
                    const countryKey = country.toLowerCase();
                    const countryConfig = countrys[countryKey];
                    if (!countryConfig) return null;

                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <h4>Currency: {countryConfig?.currency}</h4>
                        {Object.entries(SECTION_LABELS).map(([sectionKey, label]) => {
                          const sectionConfig = countryConfig[sectionKey];
                          if (!sectionConfig) return null;

                          const paymentMethods = sectionConfig.payment_methods
                            ? Object.values(sectionConfig.payment_methods)
                            : [];
                          const referenceId = getFirstReferenceId(sectionConfig);

                          return (
                            <div
                              key={sectionKey}
                              style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: 10,
                                padding: 12
                              }}
                            >
                              {/* SECTION BUTTON */}
                              <button
                                onClick={() => handlePay(label, countryConfig.currency,countryConfig.key,referenceId,countryConfig.merchant_id)}
                                disabled={loading}
                                style={buttonStyle}
                              >
                                {loading ? "Processing..." : (
                                  <span>
                                    <span
                                      style={{
                                        fontSize: 12,
                                        color: "#e5e7eb",
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                        letterSpacing: 1
                                      }}
                                    >
                                      Pay for
                                    </span>
                                    <br />
                                    <span
                                      style={{
                                        color: "#fff",
                                        fontWeight: 800,
                                        fontSize: 22
                                      }}
                                    >
                                      {label}
                                    </span>
                                  </span>
                                )}
                              </button>

                              {/* PAYMENT METHODS */}
                              {paymentMethods.length > 0 && (
                                <div style={{ marginTop: 8 }}>
                                  <div
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 600,
                                      color: "#6b7280",
                                      marginBottom: 4
                                    }}
                                  >
                                    Available payment methods:
                                  </div>

                                  <ul
                                    style={{
                                      margin: 0,
                                      paddingLeft: 18,
                                      color: "#374151",
                                      fontSize: 14,
                                      listStyle: 'none',

                                    }}
                                  >
                                    {paymentMethods.map((method, idx) => (
                                      <li key={idx} style={{marginTop:'5px'}}>
                                        {method.Payment_Name || "—"}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()
                }


              </>
            )
        }
        <div style={{ marginTop: 24 }}>
          <h2 style={{ color: status.startsWith("✅") ? "#38a169" : status.startsWith("❌") ? "#e53e3e" : "#718096", fontWeight: 600, fontSize: 20, minHeight: 32 }}>{status}</h2>
          <h3 style={{ color: status.startsWith("✅") ? "#38a169" : status.startsWith("❌") ? "#e53e3e" : "#718096", fontWeight: 600, fontSize: 20, minHeight: 32 }}>{orderNumber}</h3>
        </div>
      </div>
    </div>
  );
}
