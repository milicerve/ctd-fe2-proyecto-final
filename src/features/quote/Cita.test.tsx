import Cita from "./Cita";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render } from "../../test-utils";

const url = "https://thesimpsonsquoteapi.glitch.me/quotes";

const data = [
  {
    quote:
      "Shoplifting is a victimless crime, like punching someone in the dark.",
    character: "Nelson Muntz",
    image:
      "https://cdn.glitch.com/3c3ffadc-3406-4440-bb95-d40ec8fcde72%2FNelsonMuntz.png?1497567511185",
    characterDirection: "Left",
  },
];

export const handlers = [
  rest.get(url, (req, res, ctx) => {
    return res(ctx.json(data), ctx.status(200));
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderComponent = () => {
  render(<Cita />);
};

describe("Cita", () => {
  describe("Initial rendering", () => {
    it("should be empty", async () => {
      renderComponent();
      expect(screen.queryByText(/Nelson Muntz/i)).not.toBeInTheDocument();
    });
  });
  describe("When loading a quote", () => {
    it("should render 'LOADING' message", async () => {
      renderComponent();
      const buttonSearch = screen.getByRole("button", {
        name: /Obtener cita aleatoria/i,
      });
      userEvent.click(buttonSearch);
      await waitFor(() => {
        expect(screen.getByText(/CARGANDO/i)).toBeInTheDocument();
      });
    });
    it("should render a quote from a random character", async () => {
      renderComponent();
      const buttonSearch = screen.getByRole("button", {
        name: /Obtener cita aleatoria/i,
      });
      userEvent.click(buttonSearch);
      await waitFor(() => {
        expect(screen.getByText(/Nelson Muntz/i)).toBeInTheDocument();
      });
    });
    it("should render from the typed character", async () => {
      renderComponent();
      const input = screen.getByRole("textbox", { name: "Author Cita" });
      userEvent.type(input, "Nelson");
      const buttonSearch = await screen.findByText(/Obtener Cita/i);
      userEvent.click(buttonSearch);
      await waitFor(() => {
        expect(screen.getByText(/Nelson Muntz/i)).toBeInTheDocument();
      });
    });
    it("should handle number input by not displaying an error", async () => {
      renderComponent();
      const input = screen.getByRole("textbox", { name: "Author Cita" });
      await userEvent.clear(input);
      await userEvent.type(input, "123");
      const buttonSearch = await screen.findByText(/Obtener Cita/i);
      userEvent.click(buttonSearch);
      await waitFor(() => {
        const errorElement = screen.queryByText("El nombre debe ser un texto");
        expect(errorElement).toBeNull();
      });
    });
  });

  describe("Clear button", () => {
    it("should remove the existing message when the clear button is clicked", async () => {
      renderComponent();
      const buttonSearch = await screen.findByText(/Obtener cita aleatoria/i);
      userEvent.click(buttonSearch);
      const buttonClear = await screen.findByLabelText(/Borrar/i);
      userEvent.click(buttonClear);
      await waitFor(() => {
        expect(
          screen.getByText(/No se encontro ninguna cita/i)
        ).toBeInTheDocument();
      });
    });
  });
});
