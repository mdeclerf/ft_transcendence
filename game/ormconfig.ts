export = {
  host: 'localhost',
  type: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'task_manager',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrationsRun: false,
  logging: true,
  logger: 'file',
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
  synchronize: false,
};
