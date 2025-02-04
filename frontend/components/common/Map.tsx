type MapProps = {
    title?: string;
    address?: string;
    iframeSrc?: string;
  };
  
  function Map({
    title = 'Location Map',
    address = undefined,
    iframeSrc = undefined,
  }: MapProps) {
    return (
      <div className="mt-7">
        <iframe
          src={iframeSrc}
          width="100%"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={title}
          className="rounded-md h-[40vh]"
        ></iframe>
        <p className="mt-4 text-center font-semibold">
          Our address: <span className="font-bold">{address}</span>
        </p>
      </div>
    );
  }
  
  export default Map;