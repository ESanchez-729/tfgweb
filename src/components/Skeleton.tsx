import NavBar from './NavBar';

type Props = {
    contenido: JSX.Element
}

const Skeleton = ({contenido} : Props) => {
    return (
        <>
            <NavBar/>
            <div style={{marginTop: "20vh"}} />
            {contenido}
        </>
    )
}

export default Skeleton