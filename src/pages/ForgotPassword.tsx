import React from "react";

const ForgotPassword: React.FC = () => {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Forgot Password</h1>
      <p>Please enter your email to reset your password.</p>
      <form className="mt-4 max-w-md">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
