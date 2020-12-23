module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define("user", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              len: [1]
            }
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              len: [1]
            }
          }
    });
  
// connect user to playlists
    user.associate = function(models) {
      user.hasMany(models.playlist, {
        onDelete: "cascade"
      });
    };
  
    return user;
  };
  