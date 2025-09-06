import img404 from "assets/404.svg";

const Error404 = () => {
  return (
    <section className="flex-1 bg-white dark:bg-bgOscuro1">
      <div className="container mx-auto h-full min-h-[calc(100vh-150px)] flex flex-col items-center justify-center px-4 md:px-10 py-8">
        <img 
          src={img404} 
          className="max-h-[50vh] w-full md:max-w-2xl object-contain"
          alt="Error 404" 
        />
        <h2 className="text-3xl md:text-4xl text-center font-omnes font-bold mt-6 md:mt-12 px-4 dark: text-white">
          Página no encontrada
        </h2>
      </div>
    </section>
  );
}

export default Error404;