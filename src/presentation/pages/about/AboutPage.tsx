import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Tooltip,
  Typography,
} from '@material-tailwind/react';

export const AboutPage = () => {
  return (
    <Card className="w-96">
      <CardHeader floated={false} className="h-80">
        <img
          src="https://media.licdn.com/dms/image/v2/D4E03AQFj_OYnCzNQpA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1700085872893?e=1740614400&v=beta&t=JzT8YIGJue6cgXg3Wi-4_IBzqMLxWQEVL7okkI7FkZ0"
          alt="profile-image"
        />
      </CardHeader>
      <CardBody className="text-center">
        <Typography variant="h4" color="blue-gray" className="mb-2">
          Leandro Reyes
        </Typography>
        <Typography color="blue-gray" className="font-medium" textGradient>
          Frontend Engineer
        </Typography>
      </CardBody>
      <CardFooter className="flex justify-center gap-7 pt-2">
        <Tooltip content="LinkedIn">
          <Typography
            as="a"
            href="https://www.linkedin.com/in/leandro-n-reyes/"
            target="_blank"
            rel="noopener noreferrer"
            variant="lead"
            color="teal"
            textGradient
          >
            <i className="fab fa-linkedin" />
          </Typography>
        </Tooltip>
        <Tooltip content="Github">
          <Typography
            as="a"
            href="https://github.com/leareyes22"
            target="_blank"
            rel="noopener noreferrer"
            variant="lead"
            color="gray"
            textGradient
          >
            <i className="fab fa-github" />
          </Typography>
        </Tooltip>
      </CardFooter>
    </Card>
  );
};
