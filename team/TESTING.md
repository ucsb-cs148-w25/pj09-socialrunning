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


## **Unit Testing Plans Going Forward**
While we initially implemented unit tests for input validation, we will **minimize additional unit testing** moving forward. Given that the remainder of the quarter is short, we are optimizing for **speed and feature completion** rather than extensive test coverage. We will **only write unit tests as needed** to verify critical functionality but will not prioritize comprehensive unit testing.

---

## **Component/Integration/End-to-End Testing Implementation**
For this lab, we worked on implementing a **component test for the Spotify login feature** in `LoginScreen.js`. Since this feature relies on **Firebase authentication and Spotify OAuth**, we had to configure Jest properly to work with **React Native, Firebase, and AsyncStorage**.

### **Steps Taken:**

#### ✅ **Configured Jest to Work with React Native and Firebase**
- Modified `jest.config.js` to properly transform Flow types and ESM modules used in React Native and Firebase.
- Ensured Firebase Authentication is mocked to avoid real API calls during tests.

#### ✅ **Handled `@react-native-async-storage/async-storage` Issues**
- Created a mock for AsyncStorage to ensure Firebase authentication works correctly in the test environment.

#### ✅ **Resolved Dependency Conflicts**
- Installed necessary dependencies (`@react-native-async-storage/async-storage`, `babel-jest`).
- Cleared Jest cache and reinstalled dependencies to apply the fixes.

#### ✅ **Test Execution**
- Implemented a Jest test for `LoginScreen.js` to validate that clicking `"Login with Spotify"` correctly triggers authentication.
- Ensured that Spotify OAuth and Firebase authentication flows function as expected in the test environment.

---

## **Local Code Updates (Not Pushed to Git)**
All changes were **only applied locally** due to **dependency modifications** that could affect the project’s stability. Since Firebase and Jest required adjustments for testing, we opted **not to push these updates to Git** to avoid causing version conflicts or breaking changes for the rest of the team.

---

## **Higher-Level Testing Plans Going Forward**
We **will not commit to fully integrated testing** (such as end-to-end or deep integration testing) due to the **time constraints** of the quarter. While integration tests can be valuable, they require **significant setup time and maintenance**, which we believe is **not the best use of our limited time**. Instead, we will **focus on quick manual validation and write tests only when necessary** to ensure core functionality remains intact.
