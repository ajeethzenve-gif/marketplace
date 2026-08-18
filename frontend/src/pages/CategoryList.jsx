import { useEffect, useState } from "react";
import api from "../api/api";

function CategoryList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.get("categories/");
      setCategories(response.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Category List</h2>

      <div className="row">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div className="col-md-4 mb-4" key={category.id}>
              <div className="card shadow-sm h-100 category-card">
                <div className="card-body">
                  <h5 className="card-title">
                    {category.category_name}
                  </h5>

                  <p className="card-text">
                    {category.description || "No description available."}
                  </p>

                </div>
              </div>
            </div>
          ))
        ) : (
          <h5>No Categories Found</h5>
        )}
      </div>
    </div>
  );
}

export default CategoryList;