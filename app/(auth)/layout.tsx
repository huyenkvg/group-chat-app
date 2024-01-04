import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <div className="bg-slate-200">{children}</div>;
};

export default AuthLayout;
