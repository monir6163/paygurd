/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Pencil, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function InvoiceForm() {
  const [loader, setLoader] = useState(false);
  const [items, setItems] = useState([
    { id: 1, item: "", quantity: 1, price: "" },
  ]);
  const [logo, setLogo] = useState("");
  const [note, setNote] = useState("");
  const [merchantInfo, setMerchantInfo] = useState({
    company: "",
    invoice: "",
    name: "",
    email: "",
    date: new Date().toISOString().split("T")[0],
    currency: "",
  });
  const [billTo, setBillTo] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const handleLogoUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setLogo(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const removeLogo = () => setLogo("");
  const handleChange = (e: any, setter: Function) => {
    setter((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const addItem = () =>
    setItems([...items, { id: Date.now(), item: "", quantity: 1, price: "" }]);
  const updateItem = (id: number, key: string, value: any) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [key]: value } : i)));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (
        !items.every((i) => i.item && i.quantity && i.price) ||
        !Object.values(merchantInfo).every(Boolean) ||
        !Object.values(billTo).every(Boolean)
      ) {
        toast.error("Please fill all the details");
        return;
      }
      const data = {
        merchantInfo,
        billTo,
        items,
        note,
      };
      setLoader(true);
      const res = await axios.post("/api/paypal/create-invoice", data);
      if (res?.data?.message?.name === "VALIDATION_ERROR") {
        toast.error("Please fill all the fields");
      } else {
        toast.success("Invoice created successfully");
        // reset the form
        setItems([{ id: 1, item: "", quantity: 1, price: "" }]);
        setLogo("");
        setNote("");
        setMerchantInfo({
          company: "",
          invoice: "",
          name: "",
          email: "",
          date: new Date().toISOString().split("T")[0],
          currency: "",
        });
        setBillTo({
          first_name: "",
          last_name: "",
          email: "",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto w-full bg-neutral-50 rounded-md border border-neutral-200 shadow-md">
      <form onSubmit={handleFormSubmit}>
        <Card className="p-4 w-full">
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <div>
                {!logo ? (
                  <label className="border border-blue-500 p-4 flex items-center gap-2 cursor-pointer rounded-md">
                    <span className="text-blue-500">+</span>
                    <span className="text-blue-500 underline">
                      Add business logo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-2 border rounded-md p-2">
                    <img src={logo} alt="Logo Preview" className="h-10" />
                    <label className="cursor-pointer text-blue-500 hover:text-yellow-500">
                      <Pencil size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="text-red-500 hover:text-red-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
              <h1 className="font-bold text-xl">Invoice</h1>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input
                placeholder="Company Name"
                name="company"
                value={merchantInfo.company}
                onChange={(e) => handleChange(e, setMerchantInfo)}
              />
              <Input
                placeholder="Invoice #"
                name="invoice"
                value={merchantInfo.invoice}
                onChange={(e) => handleChange(e, setMerchantInfo)}
              />
              <Input
                placeholder="Your Name"
                name="name"
                value={merchantInfo.name}
                onChange={(e) => handleChange(e, setMerchantInfo)}
              />
              <Input
                placeholder="Email Address"
                name="email"
                value={merchantInfo.email}
                onChange={(e) => handleChange(e, setMerchantInfo)}
              />
              <Input
                type="date"
                name="date"
                value={merchantInfo.date}
                onChange={(e) => handleChange(e, setMerchantInfo)}
              />
              <select
                className="border p-2 rounded-md"
                name="currency"
                onChange={(e) => handleChange(e, setMerchantInfo)}
              >
                <option value="">Select Currency</option>
                <option value="USD">USD</option>
              </select>
            </div>

            <h3 className="font-semibold mb-2">Bill To:</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input
                placeholder="Customer First Name"
                name="first_name"
                value={billTo.first_name}
                onChange={(e) => handleChange(e, setBillTo)}
              />
              <Input
                placeholder="Customer Last Name"
                name="last_name"
                value={billTo.last_name}
                onChange={(e) => handleChange(e, setBillTo)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input
                placeholder="Customer Email"
                name="email"
                value={billTo.email}
                onChange={(e) => handleChange(e, setBillTo)}
              />
            </div>

            <h3 className="font-semibold mb-2">Items:</h3>
            <div className="space-y-2 w-full">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-3 gap-2 items-center"
                >
                  <Input
                    placeholder="Item Name"
                    value={item.item}
                    onChange={(e) =>
                      updateItem(item.id, "item", e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    min={1}
                    onChange={(e) =>
                      updateItem(item.id, "quantity", parseInt(e.target.value))
                    }
                  />
                  <div className="flex">
                    <Input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      min={1}
                      onChange={(e) =>
                        updateItem(item.id, "price", e.target.value)
                      }
                    />
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setItems(items.filter((i) => i.id !== item.id))
                        }
                        className="text-red-500 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="link"
                onClick={addItem}
                className="flex items-center gap-1"
              >
                <Plus size={16} /> Add another line item
              </Button>
            </div>

            <div className="mt-4">
              <Input
                placeholder="Note to recipient"
                name="recipient"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="flex justify-end mt-4">
              <Button type="submit">
                {loader ? "Createing Invo" : "Create Invoice"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
