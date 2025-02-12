// Define the validation function inside the test file
function validateForm(cardioZone, duration) {
    if (!cardioZone) return "Please select a cardio zone";
    if (!duration) return "Please enter a duration";
    if (parseInt(duration, 10) <= 0) return "Please enter a valid positive duration";
    return "success";
  }
  
  // Jest tests
  test("should return error if cardio zone is missing", () => {
    expect(validateForm("", "30")).toBe("Please select a cardio zone");
  });
  
  test("should return error if duration is missing", () => {
    expect(validateForm("zone1", "")).toBe("Please enter a duration");
  });
  
  test("should return error if duration is invalid", () => {
    expect(validateForm("zone1", "0")).toBe("Please enter a valid positive duration");
  });
  
  test("should return success for valid input", () => {
    expect(validateForm("zone1", "60")).toBe("success");
  });
  
