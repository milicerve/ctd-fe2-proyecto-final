import {
  TarjetaNoticia,
  ImagenTarjetaNoticia,
  TituloTarjetaNoticia,
  FechaTarjetaNoticia,
  DescripcionTarjetaNoticia,
  BotonLectura,
} from "./styled";
import { INoticiasNormalizadas } from "./useObtenerNoticias";

interface Props {
  noticia: INoticiasNormalizadas;
  onVerMas: (noticia: INoticiasNormalizadas) => void;
}

/**
 * Componente para mostrar una tarjeta de noticia.
 * @param {Object} props - Propiedades del componente.
 * @param {INoticiasNormalizadas} props.noticia - Objeto de noticia normalizada.
 * @param {Function} props.onVerMas - Manejador para ver más detalles de la noticia.
 * @returns {JSX.Element} - Elemento JSX de la tarjeta de noticia.
 */

const TarjetaNoticiaComponent: React.FC<Props> = ({ noticia, onVerMas }) => {
  return (
    <TarjetaNoticia>
      <ImagenTarjetaNoticia src={noticia.imagen} />
      <TituloTarjetaNoticia>{noticia.titulo}</TituloTarjetaNoticia>
      <FechaTarjetaNoticia>{noticia.fecha}</FechaTarjetaNoticia>
      <DescripcionTarjetaNoticia>
        {noticia.descripcionCorta}
      </DescripcionTarjetaNoticia>
      <BotonLectura onClick={() => onVerMas(noticia)}>Ver más</BotonLectura>
    </TarjetaNoticia>
  );
};

export default TarjetaNoticiaComponent;
