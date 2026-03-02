exports.getPlaces = (req, res) => {
    res.status(200).send("Obtener places");
};

exports.createPlace = (req, res) => {
    res.status(201).send("Crear place");
};

exports.updatePlace = (req, res) => {
    const { id } = req.params;
    res.status(200).send(`Actualizar place ${id}`);
};

exports.deletePlace = (req, res) => {
    const { id } = req.params;
    res.status(200).send(`Eliminar place ${id}`);
};
