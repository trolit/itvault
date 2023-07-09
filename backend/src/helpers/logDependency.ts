import chalk, { Chalk } from "chalk";
import upperCase from "lodash/upperCase";
import { DependencyLog } from "types/DependencyLog";

const config: { dependency: DependencyLog; color: Chalk }[] = [
  {
    dependency: "Express",
    color: chalk.hex("#CBF808"),
  },
  {
    dependency: "Redis",
    color: chalk.hex("#E52B50"),
  },
  {
    dependency: "RabbitMQ",
    color: chalk.hex("#FF9000"),
  },
  {
    dependency: "tsyringe",
    color: chalk.hex("#3DD7E0"),
  },
];

export const logDependency = (
  dependency: DependencyLog,
  message: string | ((chalk: Chalk) => string)
) => {
  const element = config.find(element => element.dependency === dependency);

  if (element) {
    const { dependency, color } = element;

    console.log(
      `${color(`${upperCase(dependency)}:`)} ${
        typeof message === "string" ? message : message(chalk)
      }`
    );
  }
};
