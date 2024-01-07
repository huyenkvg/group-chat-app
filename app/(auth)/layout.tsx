import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-slate-200 inset-0 flex items-center justify-center h-screen">
      {children}
    </div>
  );
};

export default AuthLayout;
