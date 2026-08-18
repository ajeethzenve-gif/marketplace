function CategoryFilter({
  categories,
  selectedCategory,
  setSelectedCategory,
  onChange,
}) {
  const handleChange = (e) => {
    const value = e.target.value;

    setSelectedCategory(value);

    onChange(value);
  };

  return (
    <select
      className="form-select mb-4"
      value={selectedCategory}
      onChange={handleChange}
    >
      <option value="">All Categories</option>

      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.category_name}
        </option>
      ))}
    </select>
  );
}

export default CategoryFilter;