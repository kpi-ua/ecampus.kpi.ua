'use strict';

/**
 * @ngdoc service
 * @name ecampusApp.permission
 * @description
 * # permission
 * Service in the ecampusApp.
 */

angular.module('ecampusApp').service('permission', PermissionService);


function PermissionService() {

  this.setPermissions = setPermissions;
  this.getPermission = getPermission;
  this.getSubsystemPermission = getSubsystemPermission;
  this.getSubsystemCathedraPermission = getSubsystemCathedraPermission;
  this.getSubsystemCathedraCRUD = getSubsystemCathedraCRUD;

  function setPermissions(permissions) {
    localStorage['permission'] = JSON.stringify(toValidPermission(permissions));
  }

  function getPermission() {
    return JSON.parse(localStorage['permission']);
  }

  function getSubsystemPermission(subsystemId) {
    var subsystemPermission = null;
    getPermission().subsystems.forEach(function (subsystem) {
      if (subsystem.id === subsystemId) {
        subsystemPermission = subsystem;
        return;
      }
    });
    return subsystemPermission;

  }

  function getSubsystemCathedraPermission(subsystemId, cathedraId) {
    var subdivisionPermission = null;
    var subsystemPermission = getSubsystemPermission(subsystemId);
    if (subsystemPermission) {
      subsystemPermission.subdivisions.forEach(function (subdivision) {
        if (subdivision.id === cathedraId) {
          subdivisionPermission = subdivision;
          return;
        }
      });
    }
    return subdivisionPermission;
  }

  function getSubsystemCathedraCRUD(subsystemId, cathedraId) {
    var cathedraPermission = getSubsystemCathedraPermission(subsystemId, cathedraId);
    if (cathedraPermission) {
      return cathedraPermission.crud;
    }
    return null;
  }

  function toValidPermission(permissions) {
    var validPermission = null;
    var numbersOfSubsystems = [];
    if (permissions) {
      validPermission = createPermissionObject();
      permissions.forEach(function (permission) {
        if (numbersOfSubsystems.indexOf(permission.subsystem) < 0) {
          numbersOfSubsystems.push(permission.subsystem);
          validPermission.subsystems
            .push(createPSubsystemObject(permission.subsystem, permission.subsystemName));
        }

        var indexOfCurrentSubsystem = numbersOfSubsystems.indexOf(permission.subsystem);
        validPermission.subsystems[indexOfCurrentSubsystem].subdivisions
          .push(createPSubdivisionObject(permission.subdivision.id, permission.subdivision.name));
      });
    }
    return validPermission;
  }

  function createPermissionObject() {
    return {
      subsystems: []
    };
  }

  function createPSubsystemObject(id, name) {
    return {
      id: id,
      name: name,
      subdivisions: []
    }
  }

  function createPSubdivisionObject(id, name, crud) {
    crud = !crud ? '0000' : crud;

    return {
      id: id,
      name: name,
      crud: crud
    }
  }
}



