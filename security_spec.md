# Security Specification (`security_spec.md`)

## 1. Data Invariants
1. **Public Catalog Read with Resource Constraint**: Customers can read `/products/{productId}` only when `isValidId(productId)` (for `get`) or `resource.data.price >= 0` (for `list`).
2. **Exclusive Shop Owner Write Access**: Only the verified shop owner (`skyblue249249@gmail.com` with `email_verified == true` or a UID present in `/admins/{uid}`) can `create`, `update`, or `delete` documents in `/products/{productId}`.
3. **Strict Schema & Key Enforcement**: Every product write must pass `isValidProduct(incoming())`, enforcing required keys, allowlisted optional keys (`originalPrice`, `image`), string length caps, and valid category/pattern enums.
4. **Temporal & Identity Immutability**: On creation, `ownerId == request.auth.uid`, `createdAt == request.time`, and `updatedAt == request.time`. On update, `id`, `ownerId`, and `createdAt` are immutable, while `updatedAt == request.time`.

## 2. The "Dirty Dozen" Payloads
1. **Unauthenticated Product Creation**: Anonymous visitor attempts to create a product in `/products/bsh-999`. -> `PERMISSION_DENIED`
2. **Non-Owner Authenticated Write**: Logged-in user (`attacker@gmail.com`) attempts to update a product price to `Rs. 1`. -> `PERMISSION_DENIED`
3. **Unverified Admin Email Spoof**: Token with `email: 'skyblue249249@gmail.com'` but `email_verified: false` attempts to delete a product. -> `PERMISSION_DENIED`
4. **Shadow Field Injection**: Owner attempts to create or update a product with an undeclared field `isSuperFeatured: true`. -> `PERMISSION_DENIED`
5. **Owner ID Spoofing on Create**: Owner attempts to create a product with `ownerId: 'someone-else-uid'`. -> `PERMISSION_DENIED`
6. **Immutable Field Mutation on Update**: Owner attempts to change `createdAt` or `ownerId` during an update. -> `PERMISSION_DENIED`
7. **Client Timestamp Forgery**: Owner sends a hardcoded string or past date for `updatedAt` instead of `serverTimestamp()` (`request.time`). -> `PERMISSION_DENIED`
8. **ID Poisoning Attack**: Attempt to create a document with a 500-character or special-character document ID. -> `PERMISSION_DENIED`
9. **Value Poisoning (Negative Price)**: Attempt to set `price: -500` on a product. -> `PERMISSION_DENIED`
10. **Category Enum Bypass**: Attempt to set `category: 'electronics'` outside the 5 allowed categories. -> `PERMISSION_DENIED`
11. **Oversized String Denial-of-Wallet**: Attempt to write a 5,000-character `name` or `description`. -> `PERMISSION_DENIED`
12. **Self-Assigned Admin Escalation**: Non-admin user attempts to create `/admins/{theirUid}` to grant themselves admin privileges. -> `PERMISSION_DENIED`
