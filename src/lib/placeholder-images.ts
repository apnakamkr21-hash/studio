import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

const placeholderImagesMap: Record<string, ImagePlaceholder> = {};
(data.placeholderImages as ImagePlaceholder[]).forEach(image => {
  placeholderImagesMap[image.id] = image;
});

export const PlaceHolderImages = placeholderImagesMap;
