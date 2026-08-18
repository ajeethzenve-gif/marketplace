import { useEffect, useState } from "react";
import api from "../api/api";

function BrandList() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const response = await api.get("brands/");
      setBrands(response.data);
    } catch (error) {
      console.error("Error loading brands:", error);
    }
  };

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Brand List</h2>

      <div className="row">

        {brands.length > 0 ? (
          brands.map((brand) => (
            <div className="col-md-4 mb-4" key={brand.id}>

              <div className="card brand-card h-100 shadow">

                <div className="card-body">

                  <h4 className="brand-title">
                    {brand.brand_name}
                  </h4>

                  <p className="text-muted">
                    {brand.description || "No Description"}
                  </p>

                </div>

              </div>

            </div>
          ))
        ) : (
          <h4>No Brands Found</h4>
        )}

      </div>

    </div>
  );
}

export default BrandList;