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
  {
    quote:
      "And this is the snack holder where I can put my beverage or, if you will, cupcake.",
    character: "Homer Simpson",
    image:
      "https://cdn.glitch.com/3c3ffadc-3406-4440-bb95-d40ec8fcde72%2FHomerSimpson.png?1497567511939",
    characterDirection: "Right",
  },
];

const validQuery = data.find((q) => q.character);

export const handlers = [
  rest.get(url, (req, res, ctx) => {
    const character = req.url.searchParams.get("character");

    if (character === null) {
      return res(ctx.json([data[1]]), ctx.delay(150));
    }

    if (validQuery) {
      return res(ctx.json([validQuery]));
    }

    return res(ctx.json([]), ctx.delay(150));
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
  describe("Cuando renderizamos", () => {
    it("No debe mostrar ninguna cita", async () => {
      renderComponent();
      expect(
        screen.getByText(/No se encontro ninguna cita/i)
      ).toBeInTheDocument();
    });
  });

  describe("Cuando se esta ejecutando", () => {
    it("Mostrar el mensaje cargando", async () => {
      renderComponent();
      const buttonSearch = await screen.findByLabelText(/Obtener Cita/i);
      userEvent.click(buttonSearch);
      await waitFor(() => {
        expect(screen.getByText(/cargando/i)).toBeInTheDocument();
      });
    });
  });

  describe("Cuando ingreso un nombre inválido", () => {
    it("Cuando ingreso un nombre inválido", async () => {
      renderComponent();
      const input = screen.getByRole("textbox", { name: "Author Cita" });
      const buttonSearch = await screen.findByLabelText(/Obtener Cita/i);
      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.keyboard("homega");
      userEvent.click(buttonSearch);

      await waitFor(() => {
        expect(
          screen.getByText(/No se encontro ninguna cita/i)
        ).toBeInTheDocument();
      });
    });

    describe("Cuando ingreso un nombre válido", () => {
      it("Deberia mostrar la cita del personaje", async () => {
        render(<Cita />);

        const input = screen.getByRole("textbox", { name: "Author Cita" });
        const buttonSearch = await screen.findByLabelText(/Obtener Cita/i);
        await userEvent.click(input);
        await userEvent.keyboard("Nelson Muntz");
        await userEvent.click(buttonSearch);

        await waitFor(() => {
          expect(
            screen.getByText(
              /Shoplifting is a victimless crime, like punching someone in the dark./i
            )
          ).toBeInTheDocument();
        });
      });
    });

    it("mostrar numeros sin error", async () => {
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

  describe("Cuando oprimo cita aleatoria", () => {
    it("Deberia traer data en la posición 1", async () => {
      render(<Cita />);

      await waitFor(() => {
        expect(
          screen.getByText(/No se encontro ninguna cita/i)
        ).toBeInTheDocument();
      });
      const buttonDelete = screen.getByLabelText(/Borrar/i);
      await userEvent.click(buttonDelete);

      const buttonSearch = await screen.findByLabelText(
        /Obtener Cita aleatoria/i
      );
      await userEvent.click(buttonSearch);

      await waitFor(() => {
        expect(
          screen.getByText(
            /And this is the snack holder where I can put my beverage or, if you will, cupcake./i
          )
        ).toBeInTheDocument();
      });
    });
  });

  describe("Cuando apreto borrar", () => {
    it("Debe borrar la cita", async () => {
      renderComponent();

      const input = screen.getByRole("textbox", { name: "Author Cita" });

      await userEvent.click(input);
      await userEvent.clear(input);
      await userEvent.keyboard("homer");

      await waitFor(() => {
        expect(screen.getByDisplayValue("homer")).toBeInTheDocument();
      });

      const buttonDelete = screen.getByLabelText(/Borrar/i);
      await userEvent.click(buttonDelete);

      await waitFor(() => {
        expect(
          screen.getByText(/No se encontro ninguna cita/i)
        ).toBeInTheDocument();
      });
      await waitFor(() => {
        expect(screen.getByDisplayValue("")).toBeInTheDocument();
      });
    });
  });
});
