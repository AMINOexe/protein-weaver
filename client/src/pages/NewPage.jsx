import React from "react";
import MainLayout from "../layout/MainLayout";
import NewQuery from "../components/NewQuery";

export default function NewPage() {
  return (
    <div>
      <MainLayout>
        <div className="main-layout-body">
            <p>
                Proteins with over K PPI's
            </p>
        <NewQuery />
        </div>
      </MainLayout>
    </div>
  );
}
