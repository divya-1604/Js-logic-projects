document.addEventListener("DOMContentLoaded", function () {
  const productCard = document.querySelectorAll(".product-card");
  //error filter is not a function because this retrieves the querySelectorAll() returns a NodeList, not a real Array.
  // const colorFilters = document.querySelectorAll("[name='color']");
  //==========Corrected Version =============//
  const colorFilters = Array.from(document.querySelectorAll("[name='color']"));
  const sizeFilters = Array.from(document.querySelectorAll("[name='size']"));

  //   Price
  const minPriceInput = document.querySelector("#min-price");
  const maxPriceInput = document.querySelector("#max-price");

  //   Available Stock
  const availableOnlyInput = document.querySelector("#available-only");
  function applyFilters() {
    const selectedColors = colorFilters
      .filter((item) => item.checked)
      .map((item) => item.value);

    const selectedSizes = sizeFilters
      .filter((item) => item.checked)
      .map((item) => item.value);

    const minPrice = minPriceInput.value ? Number(minPriceInput.value) : null;
    const maxPrice = maxPriceInput.value ? Number(maxPriceInput.value) : null;

    const availableOnly = availableOnlyInput.checked;

    productCard.forEach((product) => {
      productColor = product.dataset.color;
      productSizes = product.dataset.sizes.split(","); //('s','m','l','xl')
      productPrice = Number(product.dataset.price);
      const productAvailable = product.dataset.available === "true";
      //Color Filtering
      const matchesColor =
        selectedColors.length === 0 || selectedColors.includes(productColor);
      //Size Filtering
      const matchesSize =
        selectedSizes.length === 0 ||
        selectedSizes.some((size) => productSizes.includes(size));
      //pricing Filtering
      const matchPrices =
        (minPrice == null || productPrice >= minPrice) &&
        (maxPrice == null || productPrice <= maxPrice);
      //Availability Check
      const matchAvailability = !availableOnly || productAvailable;

      if (matchesColor && matchesSize && matchPrices && matchAvailability) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });
  }
  colorFilters.forEach((color) => {
    color.addEventListener("change", () => {
      applyFilters();
    });
  });

  sizeFilters.forEach((size) => {
    size.addEventListener("change", () => {
      applyFilters();
    });
  });

  minPriceInput.addEventListener("input", (event) => {
    applyFilters();
  });
  maxPriceInput.addEventListener("input", (event) => {
    applyFilters();
  });
  availableOnlyInput.addEventListener("change", () => {
    applyFilters();
  });
});
