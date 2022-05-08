import NavBar from './NavBar';

type Props = {

    contenido: JSX.Element

}

const Skeleton = ({contenido} : Props) => {


    return (

        <>
            <NavBar/>
            {contenido}
        </>
    )
}

export default Skeleton