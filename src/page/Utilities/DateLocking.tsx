import React from "react";
import { LSTVPageRootStyle } from "@/components/Dynamic";
import LSTVDateLock from "@/components/lstv-syspar/LSTVDateLock";

export default function DateLocking() {
  return (
    <LSTVPageRootStyle style={{ alignItems: "center", marginTop: "-150px" }}>
      <LSTVDateLock />
    </LSTVPageRootStyle>
  );
}
