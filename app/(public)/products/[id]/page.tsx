{p.stock > 0 && s.paymentEnabled ? (
  <BuyButton productId={p.id} />
) : (
  <button
    disabled
    className="mt-8 rounded-2xl bg-white px-7 py-3 font-bold text-black disabled:opacity-30"
  >
    {s.paymentEnabled ? "Rupture de stock" : "Paiement désactivé"}
  </button>
)}
