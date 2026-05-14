export interface NewUpdateModalProps {
  data: {
    title: string;
    image: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
    socialMediaLink: string;
    description: string;
    buttonText: string;
  };
  onClose: any;
}
