# Unit Testing

## Testing Libraries Used
- **Jest**: Used for writing and executing unit tests.

## Testing Approach
- We extracted core logic for the user inputs into a JavaScript function.
- Our tests check edge cases for user inputs to ensure form validation works correctly.

## Implemented Unit Tests
We created four unit tests to test the user inputs are valid before playlist creation. The validation function ensures that the users input the correct cardio zone and duration when creating a playlist.

### **Test Cases**
1. **Missing Cardio Zone**  
   - If a user does not select a cardio zone, the function should return an error message: "Please select a cardio zone".

2. **Missing Duration**  
   - If a user does not enter a duration, the function should return an error message: "Please enter a duration".

3. **Invalid Duration (Zero or Negative Value)**  
   - If a user enters `0` or a negative duration, the function should return an error message: "Please enter a valid positive duration".

4. **Valid Inputs**  
   - If a user enters a valid cardio zone and duration, the function should return `null`, indicating no errors.

## How to Run Tests
Run the following command in your project root:
```sh
npm run test:jest




