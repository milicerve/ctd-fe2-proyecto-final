import {
  CloseButton,
  TarjetaModal,
  ContenedorModal,
  DescripcionModal,
  ImagenModal,
  TituloModal,
  BotonSuscribir,
  CotenedorTexto,
} from "./styled";
import { CloseButton as Close } from "../../assets";
import { INoticiasNormalizadas } from "./useObtenerNoticias";

interface Props {
  noticia: INoticiasNormalizadas;
  onClose: () => void;
}

/**
 * Componente para mostrar el modal.
 * @param {Object} props - Propiedades del componente.
 * @param {INoticiasNormalizadas} props.noticia - Objeto de noticia normalizada.
 * @param {() => void} props.onClose - Manejador de cierre del modal.
 * @returns {JSX.Element} - Elemento JSX del modal.
 */

const ModalComponent: React.FC<Props> = ({ noticia, onClose }) => {
  return (
    <ContenedorModal>
      <TarjetaModal>
        <CloseButton onClick={onClose}>
          <img src={Close} alt="close-button" />
        </CloseButton>
        <ImagenModal src={noticia.imagen} alt="news-image" />
        <CotenedorTexto>
          {noticia.esPremium ? (
            <>
              <TituloModal>Suscríbete a nuestro Newsletter</TituloModal>
              <DescripcionModal>
                Suscríbete a nuestro newsletter y recibe noticias de nuestros
                personajes favoritos.
              </DescripcionModal>
              <BotonSuscribir
                onClick={() =>
                  setTimeout(() => {
                    alert("Suscripto!");
                    onClose();
                  }, 1000)
                }
              >
                Suscríbete
              </BotonSuscribir>
            </>
          ) : (
            <>
              <TituloModal>{noticia.titulo}</TituloModal>
              <DescripcionModal>{noticia.descripcion}</DescripcionModal>
            </>
          )}
        </CotenedorTexto>
      </TarjetaModal>
    </ContenedorModal>
  );
};

export default ModalComponent;
