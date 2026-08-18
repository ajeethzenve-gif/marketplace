function BrandFilter({
  brands,
  selectedBrand,
  setSelectedBrand,
  onChange,
}) {
  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedBrand(value);
    onChange(value);
  };

  return (
    <select
      className="form-select mb-3"
      value={selectedBrand}
      onChange={handleChange}
    >
      <option value="">All Brands</option>

      {brands.map((brand) => (
        <option key={brand.id} value={brand.id}>
          {brand.brand_name}
        </option>
      ))}
    </select>
  );
}

export default BrandFilter;