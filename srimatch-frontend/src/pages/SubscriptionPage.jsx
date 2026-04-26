import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  CheckIcon,
  XIcon,
  CrownIcon,
  HeartIcon,
  EyeIcon,
  PhoneCallIcon,
  SlidersIcon,
  MessageCircleIcon,
  TrendingUpIcon,
  ZapIcon,
  CreditCardIcon,
  StarIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowLeftIcon,
  LockIcon,
  CheckCircleIcon,
  UploadIcon,
  FileTextIcon,
  BanknoteIcon,
  CreditCardIcon as CardIcon,
  ClockIcon,
} from "lucide-react";
import SubscriptionService from "../services/subscription.service";
import PaymentService from "../services/payment.service";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .sp-root * { box-sizing: border-box; }

  .sp-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #fdf8f4;
    color: #2d1810;
    padding: 2rem 1.5rem 5rem;
  }

  .sp-inner { max-width: 960px; margin: 0 auto; }

  /* ── Back link ── */
  .sp-back {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.82rem; color: #9a7060; text-decoration: none;
    margin-bottom: 1.75rem; transition: color 0.2s; background: none; border: none;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
  }
  .sp-back:hover { color: #8b4e2e; }

  /* ── Page header ── */
  .sp-page-header { margin-bottom: 2rem; }
  .sp-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.2rem; font-weight: 600; color: #2d1810; line-height: 1.1;
  }
  .sp-page-title span {
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .sp-page-sub { font-size: 0.85rem; color: #9a7060; margin-top: 0.3rem; }

  /* ── Current plan card ── */
  .sp-current-card {
    background: #fff;
    border-radius: 22px;
    box-shadow: 0 16px 48px rgba(120,60,30,0.09), 0 4px 12px rgba(0,0,0,0.04);
    overflow: hidden;
    margin-bottom: 1.75rem;
  }

  .sp-current-header {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    padding: 1.5rem 2rem;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
  }
  .sp-current-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 600; color: #fff;
  }
  .sp-current-sub { font-size: 0.78rem; color: rgba(255,255,255,0.65); margin-top: 2px; }

  .sp-plan-pill {
    display: flex; align-items: center; gap: 0.5rem;
    background: rgba(255,255,255,0.15); backdrop-filter: blur(6px);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 99px; padding: 0.45rem 1.1rem;
  }
  .sp-plan-pill-text { font-size: 0.84rem; font-weight: 500; color: #fff; }
  .sp-plan-pill-free { color: rgba(255,255,255,0.75); }

  .sp-current-body {
    padding: 1.5rem 2rem;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
  }

  .sp-plan-details { display: flex; flex-direction: column; gap: 0.5rem; }
  .sp-plan-detail-row {
    display: flex; align-items: center; gap: 0.6rem;
    font-size: 0.82rem; color: #6b4a3a;
  }
  .sp-plan-detail-row svg { color: #8b4e2e; flex-shrink: 0; }

  .sp-plan-expires {
    font-size: 0.75rem; color: #9a7060;
    background: #fdf5ee; border: 1px solid #f0ddd5;
    border-radius: 99px; padding: 0.3rem 0.85rem;
    display: inline-flex; align-items: center; gap: 0.35rem;
  }

  .sp-action-group { display: flex; gap: 0.65rem; flex-wrap: wrap; }

  .sp-btn-boost {
    display: flex; align-items: center; gap: 0.4rem;
    padding: 0.55rem 1.25rem; border-radius: 99px;
    font-size: 0.82rem; font-weight: 500;
    background: linear-gradient(135deg, #e07a30, #c93a1a);
    color: #fff; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 12px rgba(201,58,26,0.24);
    transition: all 0.2s;
  }
  .sp-btn-boost:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(201,58,26,0.32); }
  .sp-btn-boost:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }

  .sp-btn-cancel {
    display: flex; align-items: center; gap: 0.4rem;
    padding: 0.55rem 1.25rem; border-radius: 99px;
    font-size: 0.82rem; font-weight: 500;
    background: none; border: 1.5px solid #e8ddd8; color: #6b4a3a;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .sp-btn-cancel:hover { border-color: #a84a4a; color: #a84a4a; background: #fdf0f0; }

  .sp-btn-upgrade {
    display: flex; align-items: center; gap: 0.4rem;
    padding: 0.55rem 1.5rem; border-radius: 99px;
    font-size: 0.84rem; font-weight: 500;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    color: #fff; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 6px 18px rgba(139,78,46,0.28);
    transition: all 0.2s;
  }
  .sp-btn-upgrade:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(139,78,46,0.36); }

  /* ── Features comparison ── */
  .sp-features-card {
    background: #fff;
    border-radius: 22px;
    box-shadow: 0 16px 48px rgba(120,60,30,0.09), 0 4px 12px rgba(0,0,0,0.04);
    overflow: hidden;
    margin-bottom: 1.75rem;
  }

  .sp-section-header {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    padding: 1.25rem 2rem;
  }
  .sp-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 600; color: #fff;
  }
  .sp-section-sub { font-size: 0.76rem; color: rgba(255,255,255,0.65); margin-top: 2px; }

  .sp-table-wrap { overflow-x: auto; }
  .sp-table { width: 100%; border-collapse: collapse; }
  .sp-table thead tr { background: #fdf5ee; }
  .sp-table th {
    padding: 0.85rem 1.5rem; text-align: left;
    font-size: 0.78rem; font-weight: 600; color: #6b4a3a;
    text-transform: uppercase; letter-spacing: 0.07em;
    border-bottom: 1px solid #f0ddd5;
  }
  .sp-table th.premium-col { text-align: center; background: #fdf0e8; color: #8b4e2e; }
  .sp-table th.free-col { text-align: center; }

  .sp-table tbody tr { border-bottom: 1px solid #faf3ef; transition: background 0.15s; }
  .sp-table tbody tr:hover { background: #fffbf8; }
  .sp-table tbody tr:last-child { border-bottom: none; }

  .sp-table td {
    padding: 0.85rem 1.5rem; font-size: 0.84rem; color: #4a3028;
  }
  .sp-table td.feature-cell {
    display: flex; align-items: center; gap: 0.65rem;
  }
  .sp-table td.free-cell { text-align: center; }
  .sp-table td.premium-cell { text-align: center; background: #fdf5ee; }

  .sp-feature-icon {
    width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: #fdf0e8;
  }

  .sp-check { color: #5aaa7a; }
  .sp-cross { color: #c04040; }
  .sp-premium-val { font-size: 0.8rem; font-weight: 500; color: #8b4e2e; }

  /* ── Plans grid ── */
  .sp-plans-card {
    background: #fff;
    border-radius: 22px;
    box-shadow: 0 16px 48px rgba(120,60,30,0.09), 0 4px 12px rgba(0,0,0,0.04);
    overflow: hidden;
    margin-bottom: 1.75rem;
  }

  .sp-plans-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem; padding: 2rem;
  }
  @media (max-width: 768px) { .sp-plans-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 500px) { .sp-plans-grid { grid-template-columns: 1fr; } }

  .sp-plan-card {
    border: 1.5px solid #e8ddd8; border-radius: 18px;
    padding: 1.5rem 1.25rem 1.25rem;
    position: relative; cursor: pointer;
    transition: all 0.2s; background: #fff;
  }
  .sp-plan-card:hover { border-color: #c9856a; box-shadow: 0 8px 24px rgba(139,78,46,0.1); }
  .sp-plan-card.selected {
    border-color: #8b4e2e;
    box-shadow: 0 0 0 3px rgba(139,78,46,0.12), 0 8px 24px rgba(139,78,46,0.12);
  }

  .sp-popular-badge {
    position: absolute; top: -11px; left: 50%; transform: translateX(-50%);
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    color: #fff; font-size: 0.67rem; font-weight: 600;
    padding: 0.28rem 0.85rem; border-radius: 99px;
    white-space: nowrap; letter-spacing: 0.04em;
    box-shadow: 0 4px 10px rgba(139,78,46,0.28);
  }

  .sp-plan-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem; font-weight: 600; color: #2d1810;
    text-align: center; margin-bottom: 1rem;
  }

  .sp-plan-price-wrap { text-align: center; margin-bottom: 0.4rem; }
  .sp-plan-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 600; color: #2d1810; line-height: 1;
  }
  .sp-plan-currency {
    font-size: 0.95rem; color: #9a7060; vertical-align: super; font-weight: 400;
  }
  .sp-plan-per { font-size: 0.73rem; color: #9a7060; text-align: center; margin-bottom: 0.4rem; }
  .sp-plan-save {
    text-align: center; font-size: 0.73rem; font-weight: 600;
    color: #5aaa7a; margin-bottom: 1.1rem;
  }

  .sp-plan-btn {
    width: 100%; padding: 0.6rem; border-radius: 10px;
    font-size: 0.8rem; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
    border: 1.5px solid #e8ddd8; background: #fdf8f5; color: #6b4a3a;
  }
  .sp-plan-btn.selected {
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    color: #fff; border-color: transparent;
    box-shadow: 0 4px 12px rgba(139,78,46,0.24);
  }
  .sp-plan-btn:hover { border-color: #c9856a; }

  /* ── Why premium ── */
  .sp-why-card {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    border-radius: 22px;
    padding: 2rem;
    margin-bottom: 1.75rem;
    box-shadow: 0 16px 48px rgba(30,8,2,0.18);
  }
  .sp-why-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem; font-weight: 600; color: #fff;
    text-align: center; margin-bottom: 0.4rem;
  }
  .sp-why-sub { font-size: 0.82rem; color: rgba(255,255,255,0.65); text-align: center; margin-bottom: 1.75rem; }

  .sp-why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  @media (max-width: 640px) { .sp-why-grid { grid-template-columns: 1fr; } }

  .sp-why-item {
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 14px; padding: 1.25rem 1rem; text-align: center;
  }
  .sp-why-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: rgba(255,255,255,0.12);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 0.75rem;
  }
  .sp-why-item-title { font-size: 0.88rem; font-weight: 500; color: #fff; margin-bottom: 0.3rem; }
  .sp-why-item-text { font-size: 0.76rem; color: rgba(255,255,255,0.6); line-height: 1.5; }

  /* ── Testimonials ── */
  .sp-testimonials-card {
    background: #fff;
    border-radius: 22px;
    box-shadow: 0 16px 48px rgba(120,60,30,0.09), 0 4px 12px rgba(0,0,0,0.04);
    padding: 2rem;
    margin-bottom: 1.75rem;
  }
  .sp-test-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem; font-weight: 600; color: #2d1810;
    text-align: center; margin-bottom: 1.5rem;
  }
  .sp-test-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  @media (max-width: 600px) { .sp-test-grid { grid-template-columns: 1fr; } }

  .sp-test-item {
    background: linear-gradient(135deg, #fdf5ee, #faf0f8);
    border: 1px solid #f0ddd5; border-radius: 14px;
    padding: 1.1rem 1.25rem;
    border-left: 3px solid #c9856a;
  }
  .sp-test-quote { font-size: 0.84rem; color: #4a3028; line-height: 1.65; font-style: italic; margin-bottom: 0.75rem; }
  .sp-test-author { display: flex; align-items: center; gap: 0.5rem; }
  .sp-test-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg, #fdf0e8, #f5ddd0);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 600; color: #8b4e2e; flex-shrink: 0;
  }
  .sp-test-name { font-size: 0.78rem; font-weight: 500; color: #2d1810; }
  .sp-test-loc { font-size: 0.71rem; color: #9a7060; }
  .sp-stars { color: #d4a017; font-size: 0.72rem; letter-spacing: 1px; }

  /* ── Trust badges ── */
  .sp-trust-row {
    display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap;
    margin-bottom: 1.75rem;
  }
  .sp-trust-item {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.78rem; color: #9a7060;
  }
  .sp-trust-item svg { color: #5aaa7a; }

  /* ── Payment Modal ── */
  .sp-modal-overlay {
    position: fixed; inset: 0; background: rgba(10,3,1,0.7);
    backdrop-filter: blur(4px);
    z-index: 50; display: flex; align-items: center; justify-content: center;
    padding: 1rem;
  }
  .sp-modal {
    background: #fff; border-radius: 22px;
    max-width: 500px; width: 100%;
    max-height: 90vh; overflow-y: auto;
    box-shadow: 0 24px 64px rgba(30,8,2,0.28);
    animation: sp-modal-in 0.2s ease;
  }
  @keyframes sp-modal-in { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: none; } }

  .sp-modal-header {
    background: linear-gradient(135deg, #3d1f12 0%, #6b3526 50%, #8b4e2e 100%);
    padding: 1.5rem 1.75rem 1.25rem;
    display: flex; align-items: center; justify-content: space-between;
    border-radius: 22px 22px 0 0;
  }
  .sp-modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 600; color: #fff;
  }
  .sp-modal-close {
    width: 32px; height: 32px; border-radius: 8px;
    background: rgba(255,255,255,0.15); border: none;
    color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .sp-modal-close:hover { background: rgba(255,255,255,0.28); }

  .sp-modal-body { padding: 1.5rem 1.75rem; }

  .sp-order-summary {
    background: linear-gradient(135deg, #fdf5ee, #fdf0e8);
    border: 1px solid #f0ddd5; border-radius: 14px;
    padding: 1rem 1.25rem; margin-bottom: 1.5rem;
    display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;
  }
  .sp-order-plan-name { font-size: 0.92rem; font-weight: 500; color: #2d1810; }
  .sp-order-plan-sub { font-size: 0.75rem; color: #9a7060; margin-top: 2px; }
  .sp-order-price-big { font-family: 'Cormorant Garamond', serif; font-size: 1.7rem; font-weight: 600; color: #8b4e2e; line-height: 1; }
  .sp-order-price-note { font-size: 0.69rem; color: #9a7060; text-align: right; }

  /* Form fields */
  .sp-form-label {
    display: block; font-size: 0.74rem; font-weight: 500;
    color: #6b4a3a; margin-bottom: 0.35rem;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .sp-form-group { margin-bottom: 1rem; }

  .sp-input {
    width: 100%; padding: 0.65rem 1rem;
    border: 1.5px solid #e8ddd8; border-radius: 10px;
    font-size: 0.85rem; color: #2d1810; background: #fdf8f5;
    font-family: 'DM Sans', sans-serif; outline: none;
    transition: border-color 0.2s;
  }
  .sp-input:focus { border-color: #c9856a; background: #fff; box-shadow: 0 0 0 3px rgba(201,133,106,0.1); }
  .sp-input::placeholder { color: #c4b0a5; }

  .sp-input-icon-wrap { position: relative; }
  .sp-input-icon {
    position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%);
    color: #c4a99a; pointer-events: none;
  }
  .sp-input-icon-wrap .sp-input { padding-left: 2.5rem; }

  .sp-input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

  .sp-divider { height: 1px; background: #f0ddd5; margin: 1.25rem 0; }

  .sp-total-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1.25rem;
  }
  .sp-total-label { font-size: 0.84rem; font-weight: 500; color: #4a3028; }
  .sp-total-label span { font-size: 0.72rem; color: #9a7060; display: block; margin-top: 1px; }
  .sp-total-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; font-weight: 600;
    background: linear-gradient(135deg, #8b4e2e, #c9856a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .sp-pay-btn {
    width: 100%; padding: 0.9rem;
    background: linear-gradient(135deg, #3d1f12, #8b4e2e, #c9856a);
    color: #fff; border: none; border-radius: 99px;
    font-size: 0.9rem; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 6px 18px rgba(139,78,46,0.28);
    transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  }
  .sp-pay-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(139,78,46,0.36); }

  .sp-modal-footer {
    font-size: 0.71rem; text-align: center; color: #b09080;
    margin-top: 1rem; line-height: 1.55;
  }
  .sp-modal-footer a { color: #8b4e2e; text-decoration: none; }

  .sp-secure-row {
    display: flex; justify-content: center; gap: 1.25rem; margin-top: 0.75rem; flex-wrap: wrap;
  }
  .sp-secure-item {
    display: flex; align-items: center; gap: 0.35rem;
    font-size: 0.71rem; color: #9a7060;
  }
  .sp-secure-item svg { color: #5aaa7a; }

  /* ── Ornament ── */
  .sp-ornament {
    text-align: center; font-size: 0.72rem; color: #d4b8a8;
    letter-spacing: 0.15em; margin-top: 1rem;
  }

  @media (max-width: 640px) {
    .sp-root { padding: 1.25rem 1rem 4rem; }
    .sp-page-title { font-size: 1.65rem; }
    .sp-current-header { padding: 1.25rem 1.25rem; }
    .sp-current-body { padding: 1.25rem; }
    .sp-modal-body { padding: 1.25rem; }
    .sp-modal-header { padding: 1.25rem; }
  }
`;

const SubscriptionPage = () => {
  const { subscription, upgradeSubscription, cancelSubscription, activateBoost } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [bankDetails, setBankDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingReceipt, setSubmittingReceipt] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [initiatedSubscription, setInitiatedSubscription] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("manual"); // manual, online
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasPendingApproval, setHasPendingApproval] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pkgRes, bankRes, pendingRes] = await Promise.all([
          PaymentService.getPackages(),
          PaymentService.getBankDetails(),
          PaymentService.checkPendingPayment()
        ]);
        
        if (pkgRes.success && pkgRes.data.length > 0) {
          setPlans(pkgRes.data);
          setSelectedPlan(pkgRes.data[0].id);
        }
        if (bankRes.success) setBankDetails(bankRes.data);
        if (pendingRes.success) setHasPendingApproval(pendingRes.data);
      } catch (err) {
        console.error("Error fetching subscription data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const features = [
    {
      name: "Daily Likes",
      icon: <HeartIcon size={14} style={{ color: "#c9856a" }} />,
      free: "5 per day",
      premium: "Unlimited",
    },
    {
      name: "See Who Liked You",
      icon: <EyeIcon size={14} style={{ color: "#3a6ea8" }} />,
      free: false,
      premium: true,
    },
    {
      name: "Voice & Video Calls",
      icon: <PhoneCallIcon size={14} style={{ color: "#5aaa7a" }} />,
      free: false,
      premium: true,
    },
    {
      name: "Advanced Filters",
      icon: <SlidersIcon size={14} style={{ color: "#6a40a8" }} />,
      free: false,
      premium: true,
    },
    {
      name: "Message Before Connect",
      icon: <MessageCircleIcon size={14} style={{ color: "#c07030" }} />,
      free: "—",
      premium: "3 messages",
    },
    {
      name: "Profile Boost",
      icon: <TrendingUpIcon size={14} style={{ color: "#c93a1a" }} />,
      free: false,
      premium: "1 boost (5 days)",
    },
    {
      name: "Horoscope Filter",
      icon: <StarIcon size={14} style={{ color: "#d4a017" }} />,
      free: false,
      premium: true,
    },
    {
      name: "Verified Badge",
      icon: <ShieldCheckIcon size={14} style={{ color: "#5aaa7a" }} />,
      free: false,
      premium: true,
    },
  ];

  const whyItems = [
    {
      icon: <HeartIcon size={18} color="#fff" />,
      title: "Find your match faster",
      text: "Premium members match 3× faster with unlimited likes and advanced filters.",
    },
    {
      icon: <EyeIcon size={18} color="#fff" />,
      title: "See who likes you",
      text: "Discover profiles that have already expressed interest in you.",
    },
    {
      icon: <ShieldCheckIcon size={18} color="#fff" />,
      title: "Trusted & verified",
      text: "Premium accounts get verified badges, building trust with potential matches.",
    },
  ];

  const testimonials = [
    {
      quote: "Within two weeks of upgrading, I found my now-fiancée. The advanced filters helped me find someone truly compatible.",
      name: "Kasun P.",
      loc: "Colombo",
      initials: "KP",
    },
    {
      quote: "The horoscope compatibility feature is wonderful — very important for our families. Premium was absolutely worth it.",
      name: "Malini S.",
      loc: "Kandy",
      initials: "MS",
    },
    {
      quote: "Being able to message before connecting helped me feel comfortable before sharing contact details.",
      name: "Dinesh R.",
      loc: "Galle",
      initials: "DR",
    },
    {
      quote: "Profile boost got me so many more views! Met my husband within a month of using it.",
      name: "Thilini W.",
      loc: "Negombo",
      initials: "TW",
    },
  ];

  const isPremium = subscription?.status === "ACTIVE";
  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  const boostActive =
    subscription?.features?.boostExpiresAt &&
    new Date(subscription.features.boostExpiresAt) > new Date();

  const handleActivateBoost = () => {
    if (boostActive) {
      alert(`You already have an active boost that expires on ${new Date(subscription.features.boostExpiresAt).toLocaleDateString()}`);
      return;
    }
    activateBoost();
    alert("Your profile boost has been activated! Your profile will be featured at the top of browse results for the next 5 days.");
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel your premium subscription? You will lose access to all premium features.")) {
      cancelSubscription();
      alert("Your subscription has been canceled. You can upgrade again at any time.");
    }
  };

  const handleInitiateSubscription = async (planId) => {
    if (hasPendingApproval) {
      alert("You already have a payment pending approval. Please wait for the admin to review it.");
      return;
    }
    try {
      const response = await SubscriptionService.initiateSubscription(planId);
      if (response.success) {
        setInitiatedSubscription(response.data);
        setShowPaymentModal(true);
      } else {
        alert(response.message || "Failed to initiate subscription");
      }
    } catch (err) {
      alert("An error occurred while initiating subscription");
    }
  };

  const handleReceiptUpload = async (e) => {
    e.preventDefault();
    if (!receiptFile || !initiatedSubscription) return;

    try {
      setSubmittingReceipt(true);
      const formData = new FormData();
      formData.append("receipt", receiptFile);
      
      const response = await PaymentService.submitReceipt(initiatedSubscription.id, formData);
      if (response.success) {
        alert("Receipt submitted successfully! Admin will review it shortly.");
        setShowPaymentModal(false);
        setInitiatedSubscription(null);
        setReceiptFile(null);
      } else {
        alert(response.message || "Failed to submit receipt");
      }
    } catch (err) {
      alert("Error uploading receipt");
    } finally {
      setSubmittingReceipt(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="sp-root">
        <div className="sp-inner">

          {/* Back */}
          <button className="sp-back" onClick={() => navigate(-1)}>
            <ArrowLeftIcon size={14} /> Back
          </button>

          {/* Page header */}
          <div className="sp-page-header">
            <h1 className="sp-page-title">
              {isPremium ? "Your " : "Unlock "}<span>{isPremium ? "Premium" : "Premium"}</span>
            </h1>
            <p className="sp-page-sub">
              {isPremium
                ? "Managing your SriMatch Premium subscription"
                : "Find your perfect match faster with premium features"}
            </p>
          </div>

          {/* Pending Approval Alert */}
          {hasPendingApproval && (
            <div style={{ 
              background: 'linear-gradient(135deg, #fff9f2, #fff1e6)', 
              border: '1px solid #f0ddd5', 
              borderRadius: '16px', 
              padding: '1.25rem', 
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 4px 12px rgba(139,78,46,0.06)'
            }}>
              <div style={{ background: '#fdf0e8', padding: '0.75rem', borderRadius: '12px' }}>
                <ClockIcon size={20} color="#8b4e2e" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: '#8b4e2e', marginBottom: '0.2rem', fontWeight: 600 }}>Payment Approval Pending</h4>
                <p style={{ fontSize: '0.8rem', color: '#9a7060', lineHeight: 1.5 }}>
                  We've received your receipt and are currently reviewing it. Please wait for approval; you will receive an email notification once it's confirmed.
                </p>
              </div>
            </div>
          )}

          {/* ── Current Plan card ── */}
          <div className="sp-current-card">
            <div className="sp-current-header">
              <div>
                <div className="sp-current-title">Your Current Plan</div>
                <div className="sp-current-sub">
                  {isPremium ? "You're enjoying all premium features" : "Upgrade to access all features"}
                </div>
              </div>
              <div className="sp-plan-pill">
                {isPremium ? (
                  <>
                    <CrownIcon size={14} style={{ color: "#e8c97a" }} />
                    <span className="sp-plan-pill-text">Premium Member</span>
                  </>
                ) : (
                  <>
                    <LockIcon size={14} style={{ color: "rgba(255,255,255,0.6)" }} />
                    <span className="sp-plan-pill-text sp-plan-pill-free">Free Plan</span>
                  </>
                )}
              </div>
            </div>

            <div className="sp-current-body">
              <div className="sp-plan-details">
                {isPremium ? (
                  <>
                    <div className="sp-plan-detail-row">
                      <CheckCircleIcon size={14} /><span>Status: <strong style={{ color: subscription?.status === 'ACTIVE' ? '#5aaa7a' : '#e07a30' }}>{subscription?.status}</strong></span>
                    </div>
                    <div className="sp-plan-detail-row">
                      <CheckCircleIcon size={14} /><span>Plan: <strong>{subscription?.packageName}</strong></span>
                    </div>
                    {subscription?.daysRemaining > 0 && (
                      <div className="sp-plan-detail-row">
                        <CheckCircleIcon size={14} /><span>Time remaining: <strong>{subscription.daysRemaining} days</strong></span>
                      </div>
                    )}
                    {subscription?.endDate && (
                      <div className="sp-plan-expires">
                        <CrownIcon size={11} style={{ color: "#8b4e2e" }} />
                        Expires: {new Date(subscription.endDate).toLocaleDateString("en-LK", { year: "numeric", month: "long", day: "numeric" })}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="sp-plan-detail-row">
                      <CheckCircleIcon size={14} /><span>5 likes per day</span>
                    </div>
                    <div className="sp-plan-detail-row">
                      <CheckCircleIcon size={14} /><span>Basic profile browsing</span>
                    </div>
                    <div className="sp-plan-detail-row">
                      <XIcon size={14} style={{ color: "#c04040" }} /><span style={{ color: "#9a7060" }}>No voice or video calls</span>
                    </div>
                  </>
                )}
              </div>

              <div className="sp-action-group">
                {isPremium ? (
                  <>
                    <button
                      onClick={handleActivateBoost}
                      className="sp-btn-boost"
                      disabled={boostActive}
                    >
                      <ZapIcon size={14} />
                      {boostActive ? "Boost Active" : "Activate Boost"}
                    </button>
                    <button onClick={handleCancel} className="sp-btn-cancel">
                      Cancel Plan
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleInitiateSubscription(selectedPlan)}
                    className="sp-btn-upgrade"
                  >
                    <CrownIcon size={14} /> Upgrade to Premium ✦
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Why Premium ── */}
          <div className="sp-why-card">
            <div className="sp-why-title">Why go Premium?</div>
            <div className="sp-why-sub">Join thousands of Sri Lankans who found their life partner on SriMatch</div>
            <div className="sp-why-grid">
              {whyItems.map((item, i) => (
                <div key={i} className="sp-why-item">
                  <div className="sp-why-icon">{item.icon}</div>
                  <div className="sp-why-item-title">{item.title}</div>
                  <div className="sp-why-item-text">{item.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Features comparison ── */}
          <div className="sp-features-card">
            <div className="sp-section-header">
              <div className="sp-section-title">Plan Comparison</div>
              <div className="sp-section-sub">Everything you get with Premium</div>
            </div>
            <div className="sp-table-wrap">
              <table className="sp-table">
                <thead>
                  <tr>
                    <th style={{ width: "45%" }}>Feature</th>
                    <th className="free-col">Free</th>
                    <th className="premium-col">✦ Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((f, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                          <div className="sp-feature-icon">{f.icon}</div>
                          <span>{f.name}</span>
                        </div>
                      </td>
                      <td className="free-cell">
                        {typeof f.free === "boolean" ? (
                          f.free ? <CheckIcon size={16} className="sp-check" style={{ margin: "0 auto", display: "block" }} /> : <XIcon size={16} className="sp-cross" style={{ margin: "0 auto", display: "block" }} />
                        ) : (
                          <span style={{ fontSize: "0.79rem", color: "#9a7060" }}>{f.free}</span>
                        )}
                      </td>
                      <td className="premium-cell">
                        {typeof f.premium === "boolean" ? (
                          f.premium ? <CheckIcon size={16} className="sp-check" style={{ margin: "0 auto", display: "block" }} /> : <XIcon size={16} className="sp-cross" style={{ margin: "0 auto", display: "block" }} />
                        ) : (
                          <span className="sp-premium-val">{f.premium}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Plans ── */}
          <div className="sp-plans-card">
            <div className="sp-section-header">
              <div className="sp-section-title">Choose Your Plan</div>
              <div className="sp-section-sub">Longer plans offer greater savings</div>
            </div>
            <div className="sp-plans-grid">
              {plans.map(plan => (
                <div
                  key={plan.id}
                  className={`sp-plan-card${selectedPlan === plan.id ? " selected" : ""}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.offerPercentage > 0 && <div className="sp-popular-badge">{plan.offerPercentage}% OFF</div>}

                  <div className="sp-plan-name">{plan.title}</div>
                  <div className="sp-plan-price-wrap">
                    <span className="sp-plan-currency">Rs.</span>
                    <span className="sp-plan-price">{plan.price}</span>
                  </div>
                  <div className="sp-plan-per">
                    {plan.timelineMonths} {plan.timelineMonths === 1 ? 'Month' : 'Months'}
                  </div>
                  {plan.offerPercentage > 0 ? (
                    <div className="sp-plan-save">Save {plan.offerPercentage}%</div>
                  ) : (
                    <div style={{ height: "1.2rem", marginBottom: "1.1rem" }} />
                  )}

                  <button
                    className={`sp-plan-btn${selectedPlan === plan.id ? " selected" : ""}`}
                    onClick={e => { e.stopPropagation(); setSelectedPlan(plan.id); handleInitiateSubscription(plan.id); }}
                  >
                    {selectedPlan === plan.id ? "Selected ✓" : "Choose Plan"}
                  </button>
                </div>
              ))}
            </div>

            {/* CTA below grid */}
            <div style={{ padding: "0 2rem 2rem", textAlign: "center" }}>
              <button
                className="sp-btn-upgrade"
                style={{ display: "inline-flex" }}
                onClick={() => handleInitiateSubscription(selectedPlan)}
              >
                <CrownIcon size={14} /> Get Premium — Rs. {selectedPlanData?.price} ✦
              </button>
              <p style={{ fontSize: "0.72rem", color: "#b09080", marginTop: "0.65rem" }}>
                No auto-renewal · One-time payment · Cancel anytime
              </p>
            </div>
          </div>

          {/* ── Testimonials ── */}
          <div className="sp-testimonials-card">
            <div className="sp-test-title">Success Stories from Sri Lanka</div>
            <div className="sp-test-grid">
              {testimonials.map((t, i) => (
                <div key={i} className="sp-test-item">
                  <div className="sp-stars">★★★★★</div>
                  <p className="sp-test-quote">"{t.quote}"</p>
                  <div className="sp-test-author">
                    <div className="sp-test-avatar">{t.initials}</div>
                    <div>
                      <div className="sp-test-name">{t.name}</div>
                      <div className="sp-test-loc">{t.loc}, Sri Lanka</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust badges */}
          <div className="sp-trust-row">
            <div className="sp-trust-item"><ShieldCheckIcon size={14} /> Secure payment</div>
            <div className="sp-trust-item"><LockIcon size={14} /> Privacy protected</div>
            <div className="sp-trust-item"><CheckCircleIcon size={14} /> Cancel anytime</div>
          </div>

          <div className="sp-ornament">✦ &nbsp; ✦ &nbsp; ✦</div>

        </div>
      </div>

      {/* ── Payment Modal ── */}
      {showPaymentModal && (
        <div className="sp-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="sp-modal" onClick={e => e.stopPropagation()}>

            <div className="sp-modal-header">
              <div className="sp-modal-title">Complete Your Purchase</div>
              <button className="sp-modal-close" onClick={() => setShowPaymentModal(false)}>
                <XIcon size={15} />
              </button>
            </div>

            <div className="sp-modal-body">
              {/* Order summary */}
              <div className="sp-order-summary">
                <div>
                  <div className="sp-order-plan-name">
                    <CrownIcon size={13} style={{ color: "#d4a017", display: "inline", verticalAlign: "middle", marginRight: 5 }} />
                    {selectedPlanData?.title}
                  </div>
                  <div className="sp-order-plan-sub">Validity: {selectedPlanData?.timelineMonths} months</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="sp-order-price-big">Rs. {selectedPlanData?.price}</div>
                  <div className="sp-order-price-note">one-time</div>
                </div>
              </div>

              {/* Payment Method Toggle */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button 
                  className={`sp-btn-cancel ${paymentMethod === 'manual' ? 'active' : ''}`}
                  style={{ flex: 1, border: paymentMethod === 'manual' ? '2px solid #8b4e2e' : '1px solid #e8ddd8', background: paymentMethod === 'manual' ? '#fdf5ee' : 'none' }}
                  onClick={() => setPaymentMethod('manual')}
                >
                  <BanknoteIcon size={14} /> Manual Transfer
                </button>
                <button 
                  className="sp-btn-cancel" 
                  style={{ flex: 1, opacity: 0.5, cursor: 'not-allowed' }}
                  disabled
                  title="Coming Soon"
                >
                  <CardIcon size={14} /> Online Card (Soon)
                </button>
              </div>

              {paymentMethod === 'manual' ? (
                <div className="sp-manual-payment">
                  <div style={{ background: '#fdf8f5', padding: '1rem', borderRadius: '12px', border: '1px solid #f0ddd5', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.85rem', color: '#8b4e2e', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <BanknoteIcon size={16} /> Bank Transfer Details
                    </h4>
                    {bankDetails.map(bank => (
                      <div key={bank.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed #e8ddd8' }}>
                        <p style={{ fontSize: '0.8rem', color: '#4a3028' }}><strong>Bank:</strong> {bank.bankName}</p>
                        <p style={{ fontSize: '0.8rem', color: '#4a3028' }}><strong>Branch:</strong> {bank.branchName}</p>
                        <p style={{ fontSize: '0.8rem', color: '#4a3028' }}><strong>Account:</strong> {bank.accountNumber}</p>
                        <p style={{ fontSize: '0.8rem', color: '#4a3028' }}><strong>Name:</strong> {bank.accountHolderName}</p>
                      </div>
                    ))}
                    <p style={{ fontSize: '0.75rem', color: '#9a7060', fontStyle: 'italic' }}>
                      Please transfer the total amount (Rs. {selectedPlanData?.price}) and upload the receipt below.
                    </p>
                  </div>

                  <form onSubmit={handleReceiptUpload}>
                    <div className="sp-form-group">
                      <label className="sp-form-label">Upload Receipt (Image/PDF)</label>
                      <div style={{ position: 'relative' }}>
                        <input 
                          type="file" 
                          accept="image/*,.pdf" 
                          onChange={(e) => setReceiptFile(e.target.files[0])}
                          style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer' }}
                          required
                          disabled={hasPendingApproval}
                        />
                        <div className="sp-input" style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem', 
                          color: receiptFile ? '#2d1810' : '#c4b0a5',
                          opacity: hasPendingApproval ? 0.6 : 1
                        }}>
                          <UploadIcon size={16} /> {receiptFile ? receiptFile.name : 'Select receipt file...'}
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="sp-pay-btn" 
                      disabled={submittingReceipt || hasPendingApproval}
                      style={hasPendingApproval ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                    >
                      {submittingReceipt ? (
                        <>Processing...</>
                      ) : hasPendingApproval ? (
                        <>Awaiting Approval</>
                      ) : (
                        <>
                          <CheckCircleIcon size={16} /> Submit Receipt
                        </>
                      )}
                    </button>
                    
                    {hasPendingApproval && (
                      <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#9a7060', marginTop: '0.75rem' }}>
                        Submission disabled while payment is pending approval.
                      </p>
                    )}
                  </form>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <CardIcon size={48} color="#e8ddd8" style={{ marginBottom: '1rem' }} />
                  <p style={{ color: '#9a7060', fontSize: '0.9rem' }}>Online card payments are currently being integrated. Please use Manual Transfer for now.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionPage;