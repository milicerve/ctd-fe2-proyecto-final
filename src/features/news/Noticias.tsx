import { useState } from "react";
import useObtenerNoticias, {
  INoticiasNormalizadas,
} from "./useObtenerNoticias";
import TarjetaNoticiaComponent from "./TarjetaNoticia";
import ModalComponent from "./Modal";
import { ContenedorNoticias, ListaNoticias, TituloNoticias } from "./styled";

/**
 *Componente para mostrar noticias de los Simpsons.
 * @returns {JSX.Element} - Elemento JSX que incluye el listado de las noticias e incluye logica para mostrar distintos modales.
 */

const Noticias = () => {
  const noticias = useObtenerNoticias();
  const [modal, setModal] = useState<INoticiasNormalizadas | null>(null);

  const handleVerMas = (noticia: INoticiasNormalizadas) => {
    setModal(noticia);
  };

  const handleCloseModal = () => {
    setModal(null);
  };

  return (
    <ContenedorNoticias>
      <TituloNoticias>Noticias de los Simpsons</TituloNoticias>
      <ListaNoticias>
        {noticias.map((n) => (
          <TarjetaNoticiaComponent
            key={n.id}
            noticia={n}
            onVerMas={handleVerMas}
          />
        ))}
        {modal && <ModalComponent noticia={modal} onClose={handleCloseModal} />}
      </ListaNoticias>
    </ContenedorNoticias>
  );
};

export default Noticias;
