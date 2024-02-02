import { DataTypes, Model, QueryInterface } from 'sequelize';
import { IUser } from '../../Interfaces/users/IUser';

export default  {
    up(queryInterface: QueryInterface ){
        return queryInterface.createTable<Model<IUser>>('users', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role:{
            type:DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          password: {
            allowNull: false,
            type: DataTypes.STRING,
          },

        })
    },
    down(queryInterface: QueryInterface) {
        return queryInterface.dropTable('users')
    }
}