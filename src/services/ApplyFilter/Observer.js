class Observer {
  constructor({ processRepository }) {
    this.processRepository = processRepository;
  }

  async notify(id, imgId, filterId, imgUrl) {
    await this.processRepository.updateOne(
      { _id: id, 'images._id': imgId, 'images.filters._id': filterId },
      {
        $set: {
          'images.$[image].filters.$[filter].status': 'completed',
          'images.$[image].filters.$[filter].imgUrl': 'IMAGE_URL',
        },
      },
      {
        arrayFilters: [
          { 'image._id': imgId },
          { 'filter._id': filterId },
        ],
      },
    );
  }
}

export default Observer;
