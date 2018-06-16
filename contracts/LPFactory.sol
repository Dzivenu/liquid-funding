pragma solidity ^0.4.18;

import "@aragon/os/contracts/factory/DAOFactory.sol";
import "./LPVault.sol";
import "./LiquidPledging.sol";
import "./LPConstants.sol";

contract LPFactory is LPConstants, DAOFactory(new Kernel(), new ACL(), 0) {
    bytes32 public constant RECOVERY_VAULT_ID = keccak256("recoveryVault");
    address public vaultBase;
    address public lpBase;

    event DeployVault(address vault);
    event DeployLiquidPledging(address liquidPledging);

    function LPFactory(address _vaultBase, address _lpBase) public {
        require(_vaultBase != 0);
        require(_lpBase != 0);
        vaultBase = _vaultBase;
        lpBase = _lpBase;
    }

    function newLP(address _root, address _escapeHatchDestination) external {
        Kernel kernel = newDAO(this);
        ACL acl = ACL(kernel.acl());

        bytes32 appManagerRole = kernel.APP_MANAGER_ROLE();

        acl.createPermission(this, address(kernel), appManagerRole, this);

        LPVault v = LPVault(kernel.newAppInstance(VAULT_APP_ID, vaultBase));
        // deploy & register the lp instance w/ the kernel
        LiquidPledging lp = LiquidPledging(kernel.newAppInstance(LP_APP_ID, lpBase, true));
        v.initialize(address(lp));
        lp.initialize(address(v));

        // set the recoveryVault to the escapeHatchDestination
        kernel.setRecoveryVaultId(RECOVERY_VAULT_ID);
        kernel.setApp(APP_ADDR_NAMESPACE, RECOVERY_VAULT_ID, _escapeHatchDestination);

        _setPermissions(_root, acl, kernel, v, lp);
    }

    function _setPermissions(address _root, ACL acl, Kernel kernel, LPVault v, LiquidPledging lp) internal {
        bytes32 appManagerRole = kernel.APP_MANAGER_ROLE();
        bytes32 permRole = acl.CREATE_PERMISSIONS_ROLE();
        bytes32 hatchCallerRole = v.ESCAPE_HATCH_CALLER_ROLE();
        bytes32 pluginManagerRole = lp.PLUGIN_MANAGER_ROLE();

        acl.createPermission(_root, address(v), hatchCallerRole, _root);
        acl.createPermission(_root, address(lp), hatchCallerRole, _root);
        acl.createPermission(_root, address(lp), pluginManagerRole, _root);
        // TODO: set pledgeAdminRole manager to 0x0? maybe it doesn't matter b/c it can be recreated by _root anyways

        acl.grantPermission(_root, address(kernel), appManagerRole);
        acl.grantPermission(_root, address(acl), permRole);
        acl.revokePermission(this, address(kernel), appManagerRole);
        acl.revokePermission(this, address(acl), permRole);

        acl.setPermissionManager(_root, address(kernel), appManagerRole);
        acl.setPermissionManager(_root, address(acl), permRole);

        DeployVault(address(v));
        DeployLiquidPledging(address(lp));
    }
}