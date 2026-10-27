"use client";

import { useEffect, useMemo, useState } from "react";
import { commerceApi } from "@/lib/api/commerce";
import { HoldToConfirm } from "@/components/ui/hold-to-confirm";
import { ApiError } from "@/lib/api/client";

type Address = Record<string, any>;

type AddressForm = {
  id?: string;
  title: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
};

const blankAddress: AddressForm = {
  title: "Home",
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  isDefault: false,
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState<AddressForm>(blankAddress);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadAddresses = async () => {
    try {
      const data = await commerceApi.addresses();
      setAddresses(data.addresses as Address[]);
      setError("");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Unable to load addresses");
    }
  };

  useEffect(() => {
    void loadAddresses();
  }, []);

  const defaultAddress = useMemo(() => addresses.find((address) => address.isDefault) ?? addresses[0] ?? null, [addresses]);

  const onFieldChange = (field: keyof AddressForm, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(blankAddress);
    setEditingId(null);
  };

  const onSubmit = async () => {
    const payload = {
      title: form.title || "Home",
      fullName: form.fullName,
      phone: form.phone,
      addressLine1: form.addressLine1,
      addressLine2: form.addressLine2,
      landmark: form.landmark,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      country: form.country || "India",
      isDefault: form.isDefault,
    };

    if (!payload.fullName || !payload.phone || !payload.addressLine1 || !payload.city || !payload.state || !payload.pincode) {
      setError("Please complete all required address fields.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      if (editingId) {
        await commerceApi.updateAddress(editingId, payload);
      } else {
        await commerceApi.createAddress(payload);
      }
      resetForm();
      await loadAddresses();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Unable to save address.");
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (address: Address) => {
    setEditingId(String(address.id));
    setForm({
      id: String(address.id),
      title: String(address.title ?? "Home"),
      fullName: String(address.fullName ?? ""),
      phone: String(address.phone ?? ""),
      addressLine1: String(address.addressLine1 ?? ""),
      addressLine2: String(address.addressLine2 ?? ""),
      landmark: String(address.landmark ?? ""),
      city: String(address.city ?? ""),
      state: String(address.state ?? ""),
      pincode: String(address.pincode ?? ""),
      country: String(address.country ?? "India"),
      isDefault: Boolean(address.isDefault),
    });
  };

  const onDelete = async (id: string) => {
    try {
      await commerceApi.deleteAddress(id);
      await loadAddresses();
      if (editingId === id) resetForm();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Unable to delete address.");
    }
  };

  const onSetDefault = async (id: string) => {
    try {
      await commerceApi.updateAddress(id, { isDefault: true });
      await loadAddresses();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Unable to set default address.");
    }
  };

  return (
    <main className="container-page py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-navy">My Addresses</h1>
          <p className="mt-2 text-sm text-slate-soft">{defaultAddress ? `Default address: ${String(defaultAddress.title ?? "Home")}` : "No default address yet."}</p>
        </div>
        <button
          type="button"
          onClick={resetForm}
          className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white"
        >
          {editingId ? "Cancel edit" : "Add new address"}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-navy">{editingId ? "Edit address" : "Add a new address"}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="text-sm text-slate-soft">
              Label
              <input value={form.title} onChange={(event) => onFieldChange("title", event.target.value)} className="mt-1 h-11 w-full rounded border border-line bg-slate-50 px-3 text-sm text-navy" />
            </label>
            <label className="text-sm text-slate-soft">
              Full name
              <input value={form.fullName} onChange={(event) => onFieldChange("fullName", event.target.value)} className="mt-1 h-11 w-full rounded border border-line bg-slate-50 px-3 text-sm text-navy" />
            </label>
            <label className="text-sm text-slate-soft md:col-span-2">
              Phone number
              <input value={form.phone} onChange={(event) => onFieldChange("phone", event.target.value)} className="mt-1 h-11 w-full rounded border border-line bg-slate-50 px-3 text-sm text-navy" />
            </label>
            <label className="text-sm text-slate-soft md:col-span-2">
              Street address
              <input value={form.addressLine1} onChange={(event) => onFieldChange("addressLine1", event.target.value)} className="mt-1 h-11 w-full rounded border border-line bg-slate-50 px-3 text-sm text-navy" />
            </label>
            <label className="text-sm text-slate-soft md:col-span-2">
              Apartment / local area
              <input value={form.addressLine2} onChange={(event) => onFieldChange("addressLine2", event.target.value)} className="mt-1 h-11 w-full rounded border border-line bg-slate-50 px-3 text-sm text-navy" />
            </label>
            <label className="text-sm text-slate-soft">
              Landmark
              <input value={form.landmark} onChange={(event) => onFieldChange("landmark", event.target.value)} className="mt-1 h-11 w-full rounded border border-line bg-slate-50 px-3 text-sm text-navy" />
            </label>
            <label className="text-sm text-slate-soft">
              City
              <input value={form.city} onChange={(event) => onFieldChange("city", event.target.value)} className="mt-1 h-11 w-full rounded border border-line bg-slate-50 px-3 text-sm text-navy" />
            </label>
            <label className="text-sm text-slate-soft">
              State
              <input value={form.state} onChange={(event) => onFieldChange("state", event.target.value)} className="mt-1 h-11 w-full rounded border border-line bg-slate-50 px-3 text-sm text-navy" />
            </label>
            <label className="text-sm text-slate-soft">
              Pincode
              <input value={form.pincode} onChange={(event) => onFieldChange("pincode", event.target.value)} className="mt-1 h-11 w-full rounded border border-line bg-slate-50 px-3 text-sm text-navy" />
            </label>
            <label className="text-sm text-slate-soft">
              Country
              <input value={form.country} onChange={(event) => onFieldChange("country", event.target.value)} className="mt-1 h-11 w-full rounded border border-line bg-slate-50 px-3 text-sm text-navy" />
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-soft md:col-span-2">
              <input type="checkbox" checked={form.isDefault} onChange={(event) => onFieldChange("isDefault", event.target.checked)} className="h-4 w-4" />
              Set as default address
            </label>
          </div>
          <button type="button" onClick={() => void onSubmit()} disabled={submitting} className="mt-5 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
            {submitting ? "Saving..." : editingId ? "Update address" : "Save address"}
          </button>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-navy">Saved addresses</h2>
          <div className="mt-4 space-y-3">
            {addresses.length ? addresses.map((address) => (
              <article key={String(address.id)} className="rounded-xl border border-line p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-bold text-navy">{String(address.title ?? "Home")}</strong>
                      {Boolean(address.isDefault) && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Default</span>}
                    </div>
                    <p className="mt-2 text-sm text-slate-soft">{String(address.fullName)} • {String(address.phone)}</p>
                    <p className="mt-1 text-sm text-slate-soft">
                      {String(address.addressLine1)}{address.addressLine2 ? `, ${String(address.addressLine2)}` : ""}, {String(address.city)}, {String(address.state)} {String(address.pincode)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <button type="button" onClick={() => onEdit(address)} className="rounded-full border border-line px-3 py-1.5 font-semibold text-navy">Edit</button>
                  {!address.isDefault && <button type="button" onClick={() => void onSetDefault(String(address.id))} className="rounded-full border border-line px-3 py-1.5 font-semibold text-navy">Set default</button>}
                  <HoldToConfirm onConfirm={() => void onDelete(String(address.id))} className="rounded-full border border-red-200 px-3 py-1.5 font-semibold text-red-600">Hold to Delete</HoldToConfirm>
                </div>
              </article>
            )) : <p className="text-sm text-slate-soft">No saved addresses.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
