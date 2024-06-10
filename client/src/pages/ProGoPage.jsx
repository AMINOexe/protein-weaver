import React from "react";
import MainLayout from "../layout/MainLayout";
import PGCounter from "../components/ProGoCounter";

export default function ProGoPage() {
  return (
    <div>
      <MainLayout>
        <div className="new-query-label">ProGo Interaction Counter</div>
          <PGCounter />
      </MainLayout>
    </div>
  );
}