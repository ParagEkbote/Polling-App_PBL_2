import React from 'react';

const GoogleFormCard = () => {
  const handleClick = () => {
    window.open('https://forms.gle/93suNFnHXDemfuP3A', '_blank');
  };

  return (
    <Card className="max-w-md mx-auto">
      <FormGroup>
        <Label>
          Google Form Access
        </Label>
        <div className="text-gray-600 mb-4">
          Please click the button below to access our form. You will be redirected to Google Forms in a new tab.
        </div>
        <Button 
          variant="primary" 
          size="lg" 
          onClick={handleClick}
          className="w-full"
        >
          Open Google Form
        </Button>
      </FormGroup>
    </Card>
  );
};

export default GoogleFormCard;