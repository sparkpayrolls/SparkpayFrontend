// @ant-design/icons@4.7.0 ships no type declarations, which breaks `next build`
// (it typechecks the whole project). Minimal ambient declaration to unblock.
declare module '@ant-design/icons';
