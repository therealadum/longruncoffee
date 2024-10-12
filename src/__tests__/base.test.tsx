import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

function MyComponent() {
  return <p>hello world</p>;
}

test("renders the component", () => {
  render(<MyComponent />);
  const element = screen.getByText(/hello world/i);
  expect(element).toBeInTheDocument();
});
