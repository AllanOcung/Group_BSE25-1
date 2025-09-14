import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register, handleSubmit } = useForm<{name:string; email:string; password:string}>();
  const auth = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await auth.register(data);
      navigate("/dashboard");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white">
      <h1 className="text-xl mb-4">Register</h1>
      <input {...register("name")} placeholder="Name" className="w-full p-2 mb-2 border rounded" required/>
      <input {...register("email")} placeholder="Email" className="w-full p-2 mb-2 border rounded" required/>
      <input {...register("password")} type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded" required/>
      <button className="px-4 py-2 bg-green-600 text-white rounded">Create account</button>
    </form>
  );
}
